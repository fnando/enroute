# frozen_string_literal: true

module Enroute
  module Routes
    extend self

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
        typeName: "#{route.name.camelize}RouteHandler",
        incomingPattern: camelize_pattern(route),
        outgoingPattern: route.ast.to_s,
        method: reduce_methods(routes),
        segments: route.segments,
        requiredSegments: route.path.required_names
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
      routes.reject do |route|
        route.name =~ /rails|script/
      end
    end

    def routes
      Rails.application.routes.routes
    end
  end
end
