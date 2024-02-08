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
        .map {|route| build_ts_route_function(route) }
        .join("\n\n")
    end

    def handler_functions
      routes.map {|route| build_ts_handler_function(route) }.join("\n\n")
    end

    def render_template
      ERB.new(File.read("#{__dir__}/template.ts.erb")).result binding
    end

    def build_ts_args_definition(route)
      args = route[:segments].each_with_object([]) do |segment, buffer|
        type = route.dig(:typings, segment)&.chomp ||
               config.dig(:typings, :_default, segment)&.chomp ||
               "any"

        optional = route[:requiredSegments].include?(segment) ? "" : "?"

        buffer << "#{segment.camelize(:lower)}#{optional}: #{type}"
      end

      args << "params?: Record<string, unknown>"

      "args?: {#{args.join('; ')}}"

      # (args + ["params: Record<string, unknown> = {}"]).join(", ")
    end

    def build_ts_handler_function(route)
      args = JSON.pretty_generate(route.except(:typings))
      %[const #{route[:name]}Handler = buildRoute(#{args});]
    end

    def build_ts_route_function(route)
      args = build_ts_args_definition(route)

      segments = route[:segments].map {|segment| segment.camelize(:lower) }
      destruct = [segments.join(", "), "params"].reject(&:blank?).join(", ")

      <<~TYPESCRIPT
        export function #{route[:name]}Url(#{args}): string {
          const {#{destruct}} = args ?? {};
          return buildUrl(#{route[:name]}Handler(#{segments.join(', ')}), params ?? {}).url;
        }

        export function #{route[:name]}Path(#{args}): string {
          const {#{destruct}} = args ?? {};
          return buildUrl(#{route[:name]}Handler(#{segments.join(', ')}), params ?? {}).path;
        }
      TYPESCRIPT
    end
  end
end
