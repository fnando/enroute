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

    output_path = File.join(__dir__, "routes_with_config.ts")
    config_path = File.join(__dir__, "../enroute.yml")
    Enroute::Export.call(output_path, config_path)

    system "tsc",
           "--noEmit",
           "--project",
           Dir.pwd,
           exception: true

    output_file_contents = File.read(output_path)

    refute_includes output_file_contents, "login"
    refute_includes output_file_contents, "Login"
    assert_includes output_file_contents,
                    %[export const toggleUrl = (value: "newsletter" | "notifications", format?: string): string =>] # rubocop:disable Layout/LineLength
    assert_includes output_file_contents,
                    %[export const editSettingsUrl = (section?: string, format?: "json" | "yml"): string =>] # rubocop:disable Layout/LineLength
    refute_includes output_file_contents,
                    %[export const profileUrl = (format?: string): string =>]
  end
end
