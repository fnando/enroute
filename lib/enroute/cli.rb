# frozen_string_literal: true

module Enroute
  class CLI < Thor
    def self.exit_on_failure?
      true
    end

    desc "version", "Display version"
    map %w[-v --version] => :version

    def version
      say "Enroute #{Enroute::VERSION}"
    end

    desc "export", "Export route definitions"
    option :require,
           type: :string,
           aliases: :r,
           default: File.join(Dir.pwd, "config/environment.rb")

    option :output,
           type: :string,
           required: true,
           aliases: :o

    def export
      require_path = File.expand_path(options["require"])
      output_path = File.expand_path(options["output"])

      require require_path
      Export.call(output_path)
    end
  end
end
