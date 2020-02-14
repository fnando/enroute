# frozen_string_literal: true

require "thor"
require "fileutils"
require "erb"
require "json"

module Enroute
  require_relative "enroute/version"
  require_relative "enroute/routes"
  require_relative "enroute/export"
  require_relative "enroute/cli"

  class Error < StandardError; end
end
