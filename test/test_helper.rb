# frozen_string_literal: true

require "bundler/setup"

require "rails"
require "enroute"

require "minitest/utils"
require "minitest/autorun"

class App < Rails::Application
end

module Minitest
  class Test
    def with_routes(&block)
      Rails.application.routes.draw(&block)
    end
  end
end
