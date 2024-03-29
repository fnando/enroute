# frozen_string_literal: true

require "test_helper"

class RoutesTest < Minitest::Test
  test "returns payload for root route" do
    with_routes { root to: "pages#home" }

    routes = Enroute::Routes.call
    expected = {
      name: "root",
      incomingPattern: "/",
      outgoingPattern: "/",
      method: %w[get],
      segments: [],
      requiredSegments: [],
      typings: {}
    }

    assert_equal 1, routes.size
    assert_equal expected, routes.first
  end

  test "returns payload for `get`" do
    with_routes { get "home" => "pages#home" }

    routes = Enroute::Routes.call
    expected = {
      name: "home",
      incomingPattern: "/home(.:format)",
      outgoingPattern: "/home(.:format)",
      method: %w[get],
      segments: %w[format],
      requiredSegments: [],
      typings: {}
    }

    assert_equal 1, routes.size
    assert_equal expected, routes.first
  end

  test "returns payload for `resources`" do
    with_routes { resources :users }

    routes = Enroute::Routes.call

    root_path = {
      name: "users",
      incomingPattern: "/users(.:format)",
      outgoingPattern: "/users(.:format)",
      method: %w[get post patch put delete],
      segments: ["format"],
      requiredSegments: [],
      typings: {}
    }

    new_path = {
      name: "newUser",
      incomingPattern: "/users/new(.:format)",
      outgoingPattern: "/users/new(.:format)",
      method: %w[get post patch put delete],
      segments: ["format"],
      requiredSegments: [],
      typings: {}
    }

    edit_path = {
      name: "editUser",
      incomingPattern: "/users/:id/edit(.:format)",
      outgoingPattern: "/users/:id/edit(.:format)",
      method: %w[get post patch put delete],
      segments: %w[id format],
      requiredSegments: ["id"],
      typings: {}
    }

    show_path = {
      name: "user",
      incomingPattern: "/users/:id(.:format)",
      outgoingPattern: "/users/:id(.:format)",
      method: %w[get post patch put delete],
      segments: %w[id format],
      requiredSegments: ["id"],
      typings: {}
    }

    assert_equal 4, routes.size
    assert_includes routes, root_path
    assert_includes routes, new_path
    assert_includes routes, edit_path
    assert_includes routes, show_path
  end
end
