# frozen_string_literal: true

require "test_helper"

class RoutesTest < Minitest::Test
  test "returns payload for root route" do
    with_routes { root to: "pages#home" }

    routes = Enroute::Routes.call
    expected = {
      name: "root",
      typeName: "RootRouteHandler",
      incomingPattern: "/",
      outgoingPattern: "/",
      method: %w[get],
      segments: [],
      requiredSegments: []
    }

    assert_equal 1, routes.size
    assert_equal expected, routes.first
  end

  test "returns payload for `get`" do
    with_routes { get "home" => "pages#home" }

    routes = Enroute::Routes.call
    expected = {
      name: "home",
      typeName: "HomeRouteHandler",
      incomingPattern: "/home(.:format)",
      outgoingPattern: "/home(.:format)",
      method: %w[get],
      segments: %w[format],
      requiredSegments: []
    }

    assert_equal 1, routes.size
    assert_equal expected, routes.first
  end

  test "returns payload for `resources`" do
    with_routes { resources :users }

    routes = Enroute::Routes.call

    root_path = {
      name: "users",
      typeName: "UsersRouteHandler",
      incomingPattern: "/users(.:format)",
      outgoingPattern: "/users(.:format)",
      method: %w[get post patch put delete],
      segments: ["format"], requiredSegments: []
    }

    new_path = {
      name: "newUser",
      typeName: "NewUserRouteHandler",
      incomingPattern: "/users/new(.:format)",
      outgoingPattern: "/users/new(.:format)",
      method: %w[get post patch put delete],
      segments: ["format"],
      requiredSegments: []
    }

    edit_path = {
      name: "editUser",
      typeName: "EditUserRouteHandler",
      incomingPattern: "/users/:id/edit(.:format)",
      outgoingPattern: "/users/:id/edit(.:format)",
      method: %w[get post patch put delete],
      segments: %w[id format],
      requiredSegments: ["id"]
    }

    show_path = {
      name: "user",
      typeName: "UserRouteHandler",
      incomingPattern: "/users/:id(.:format)",
      outgoingPattern: "/users/:id(.:format)",
      method: %w[get post patch put delete],
      segments: %w[id format],
      requiredSegments: ["id"]
    }

    assert_equal 4, routes.size
    assert_includes routes, root_path
    assert_includes routes, new_path
    assert_includes routes, edit_path
    assert_includes routes, show_path
  end
end
