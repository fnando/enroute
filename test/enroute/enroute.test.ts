// @ts-expect-error
global.location = {
  protocol: "http:",
  host: "localhost",
};

import {
  editProfilePath,
  editSettingsPath,
  editUserCommentPath,
  editUserPath,
  loginPath,
  logoutPath,
  newProfilePath,
  newUserCommentPath,
  newUserPath,
  profilePath,
  rootPath,
  rootUrl,
  togglePath,
  userCommentsPath,
  usersPath,
} from "./routes";

test("returns root url", () => {
  expect(rootPath()).toEqual("/");
  expect(rootUrl()).toEqual("http://localhost/");
});

test("appends query string", () => {
  expect(rootPath({ a: 1 })).toEqual("/?a=1");
  expect(rootUrl({ a: 1 })).toEqual("http://localhost/?a=1");
});

test("returns urls for `resources :users`", () => {
  expect(usersPath()).toEqual("/users");
  expect(editUserPath("user-1234")).toEqual("/users/user-1234/edit");
  expect(newUserPath()).toEqual("/users/new");
});

test("returns urls for nested resource", () => {
  expect(userCommentsPath("user-1234")).toEqual("/users/user-1234/comments");
  expect(newUserCommentPath("user-1234")).toEqual(
    "/users/user-1234/comments/new",
  );
  expect(editUserCommentPath("user-1234", "comment-1234")).toEqual(
    "/users/user-1234/comments/comment-1234/edit",
  );
});

test("returns urls for `resource :profile`", () => {
  expect(profilePath()).toEqual("/profile");
  expect(newProfilePath()).toEqual("/profile/new");
  expect(editProfilePath()).toEqual("/profile/edit");
});

test("returns url for verb routes", () => {
  expect(loginPath()).toEqual("/login");
  expect(logoutPath()).toEqual("/logout");
});

test("returns url for optional segment", () => {
  expect(editSettingsPath()).toEqual("/settings/edit");
  expect(editSettingsPath(null, "json")).toEqual("/settings/edit.json");
  expect(editSettingsPath("security")).toEqual("/settings/edit/security");
  expect(editSettingsPath("security", "json")).toEqual(
    "/settings/edit/security.json",
  );
});

test("returns url with format", () => {
  expect(usersPath("json")).toEqual("/users.json");
});

test("uses boolean as a parameter", () => {
  expect(togglePath(false)).toEqual("/toggle/false");
  expect(togglePath(true)).toEqual("/toggle/true");
});

test("uses number as a parameter", () => {
  expect(togglePath(0)).toEqual("/toggle/0");
  expect(togglePath(1)).toEqual("/toggle/1");
});

test("raises exception with invalid required segments", () => {
  expect(() => togglePath(null)).toThrow(
    "value is required, but received null",
  );

  expect(() => togglePath(undefined)).toThrow(
    "value is required, but received undefined",
  );

  expect(() => togglePath(" ")).toThrow('value is required, but received " "');
  expect(() => togglePath([])).toThrow("value is required, but received []");
});
