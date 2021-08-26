# frozen_string_literal: true

module Enroute
  class Export
    attr_reader :output_path, :config_path

    def self.call(output_path, config_path)
      new(output_path, config_path).call
    end

    def initialize(output_path, config_path)
      @output_path = output_path
      @config_path = config_path
    end

    def config
      @config ||= if File.file?(config_path)
                    ActiveSupport::HashWithIndifferentAccess.new(
                      YAML.load_file(config_path)
                    )
                  else
                    {}
                  end
    end

    def call
      FileUtils.mkdir_p(File.dirname(output_path))

      write_template(output_path)
    end

    def params
      {
        routes: routes,
        types: routes.map {|route| build_ts_definition(route) }.join("\n"),
        router_type: routes.map {|route| build_ts_route_definition(route) }.join
      }
    end

    def routes
      @routes ||= Routes.call(config)
    end

    def write_template(output_path)
      File.open(output_path, "w+") do |file|
        file << render_template
      end
    end

    def route_functions
      routes
        .each_with_index
        .map {|route, index| build_ts_function(route, index) }
        .join("\n\n")
    end

    def router_type_definitions
      routes.map {|route| build_ts_route_definition(route) }.join
    end

    def type_definitions
      routes.map {|route| build_ts_definition(route) }.join("\n")
    end

    def render_template
      ERB.new(File.read("#{__dir__}/template.ts.erb")).result binding
    end

    def build_ts_definition(route)
      [
        "export interface #{route[:typeName]} extends RouteHandler {",
        "  (#{build_ts_args_definition(route)}): string;",
        "}\n"
      ].join("\n")
    end

    def build_ts_args_definition(route)
      route[:segments].map do |segment|
        type = route.dig(:typings, segment)&.chomp ||
               config.dig(:typings, :_default, segment)&.chomp ||
               "any"

        optional = route[:requiredSegments].include?(segment) ? "" : "?"
        "#{segment.camelize(:lower)}#{optional}: #{type}"
      end.join(", ")
    end

    def build_ts_function(route, index)
      args = build_ts_args_definition(route)
      segments = route[:segments].map {|segment| segment.camelize(:lower) }

      [
        %[export const #{route[:name]}Url = (#{args}): string =>],
        %[  routeHandlers[#{index}](#{segments.join(', ')});]
      ].join("\n")
    end

    def build_ts_route_definition(route)
      %[\n  #{route[:name]}: #{route[:typeName]};]
    end
  end
end
