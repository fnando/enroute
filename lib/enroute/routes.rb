# frozen_string_literal: true

module Enroute
  class Routes
    attr_reader :config

    def self.call(config = {})
      new(config).call
    end

    def initialize(config)
      @config = config
    end

    def call
      grouped_routes.each_with_object([]) do |(_pattern, routes), buffer|
        route = routes.find {|r| r.name.present? }

        next unless route

        buffer << build_payload(route)
      end
    end

    def build_payload(route)
      {
        name: route.name.camelize(:lower),
        incomingPattern: camelize_pattern(route),
        outgoingPattern: route.ast.to_s,
        method: reduce_methods(routes),
        segments: route.segments,
        requiredSegments: route.path.required_names,
        typings: config.dig(:typings, route.name) || {}
      }
    end

    def camelize_pattern(route)
      route
        .ast
        .to_s
        .gsub(/_(.)/) { Regexp.last_match(1).upcase }
    end

    def reduce_methods(routes)
      routes.map(&:verb).flatten.map(&:downcase).uniq
    end

    def camelize_map(list)
      list.map {|item| item.camelize(:lower) }
    end

    def grouped_routes
      filtered_routes.group_by do |route|
        route.ast.to_s
      end
    end

    def filtered_routes
      only_conditions = config.fetch(:only, [])

      # If `:only` has at least one item, then select matching routes.
      # Otherwise, use all routes.
      selected_routes = if only_conditions.empty?
                          routes
                        else
                          routes.select do |route|
                            only_conditions.include?(route.name)
                          end
                        end

      # Filter out unnamed routes, Rails' internal routes, and anything present
      # on `:ignore`.
      selected_routes.reject do |route|
        route.name.nil? ||
          route.name.match?(/rails|script/) ||
          config.fetch(:ignore, []).include?(route.name)
      end
    end

    def routes
      Rails.application.routes.routes
    end
  end
end
