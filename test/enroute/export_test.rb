# frozen_string_literal: true

require "test_helper"

class ExportTest < Minitest::Test
  test "exports routes" do
    with_routes do
      root to: "pages#home"

      resources :users do
        resources :comments
      end

      resource :profile

      get "login" => "login#new", as: "login"
      post "login" => "login#create"
      delete "logout" => "login#destroy"
      get "settings/edit(/:section)" => "profile#edit", as: "edit_settings"
      post "toggle/:value" => "toggle#update", as: "toggle"
    end

    output_path = File.join(__dir__, "routes.ts")
    Enroute::Export.call(output_path, "enroute.yml")

    system "tsc",
           "--noEmit",
           "--project",
           Dir.pwd,
           exception: true

    system "jest",
           File.join(Dir.pwd, "test/enroute/enroute.test.ts"),
           exception: true
  end

  test "exports routes with config" do
    with_routes do
      root to: "pages#home"

      resources :users do
        resources :comments
      end

      resource :profile

      get "login" => "login#new", as: "login"
      post "login" => "login#create"
      delete "logout" => "login#destroy"
      get "settings/edit(/:section)" => "profile#edit", as: "edit_settings"
      post "toggle/:value" => "toggle#update", as: "toggle"
    end

    output_path = File.join(__dir__, "routes_with_filter.ts")
    config_path = File.join(__dir__, "../enroute.yml")
    Enroute::Export.call(output_path, config_path)

    system "tsc",
           "--noEmit",
           "--project",
           Dir.pwd,
           exception: true

    refute File.read(output_path).include?("login")
    refute File.read(output_path).include?("Login")
  end
end
