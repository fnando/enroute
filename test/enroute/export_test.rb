# frozen_string_literal: true

require "test_helper"

class ExportTest < Minitest::Test
  setup do
    %w[routes.ts routes_with_config.ts].each do |file|
      path = File.join(__dir__, file)

      File.unlink(path) if File.file?(path)
    end

    export_routes_ts
    export_routes_with_config_ts
  end

  def export_routes_ts
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
  end

  def export_routes_with_config_ts
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
  end

  test "exports routes" do
    system "yarn",
           "tsc",
           "--noEmit",
           "--project",
           Dir.pwd,
           exception: true

    system "yarn",
           "jest",
           File.join(Dir.pwd, "test/enroute/enroute.test.ts"),
           exception: true
  end

  test "exports routes with config" do
    system "yarn",
           "tsc",
           "--noEmit",
           "--project",
           Dir.pwd,
           exception: true

    output_file_contents =
      File.read(File.join(__dir__, "routes_with_config.ts"))

    refute_includes output_file_contents, "login"
    refute_includes output_file_contents, "Login"
    assert_includes output_file_contents,
                    %[export function togglePath(value: "newsletter" | "notifications", format?: string, params: Record<string, unknown> = {}): string {] # rubocop:disable Layout/LineLength
    assert_includes output_file_contents,
                    %[export function toggleUrl(value: "newsletter" | "notifications", format?: string, params: Record<string, unknown> = {}): string {] # rubocop:disable Layout/LineLength
    assert_includes output_file_contents,
                    %[export function editSettingsPath(section?: string, format?: "json" | "yml", params: Record<string, unknown> = {}): string {] # rubocop:disable Layout/LineLength
    assert_includes output_file_contents,
                    %[export function editSettingsUrl(section?: string, format?: "json" | "yml", params: Record<string, unknown> = {}): string {] # rubocop:disable Layout/LineLength
    refute_includes output_file_contents,
                    %[export function profilePath(format?: string, params: Record<string, unknown> = {}): string {] # rubocop:disable Layout/LineLength
    refute_includes output_file_contents,
                    %[export function profileUrl(format?: string, params: Record<string, unknown> = {}): string {] # rubocop:disable Layout/LineLength
  end
end
