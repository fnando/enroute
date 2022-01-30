# frozen_string_literal: true

require "thor"

begin
  require "active_support/isolated_execution_state"
rescue LoadError
  # noop
end

require "active_support/core_ext/hash"
require "active_support/hash_with_indifferent_access"
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
