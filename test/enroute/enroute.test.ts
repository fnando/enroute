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
  expect(rootPath({ params: { a: 1 } })).toEqual("/?a=1");
  expect(rootUrl({ params: { a: 1 } })).toEqual("http://localhost/?a=1");
});

test("returns urls for `resources :users`", () => {
  expect(usersPath()).toEqual("/users");
  expect(editUserPath({ id: "user-1234" })).toEqual("/users/user-1234/edit");
  expect(newUserPath()).toEqual("/users/new");
});

test("returns urls for nested resource", () => {
  expect(userCommentsPath({ userId: "user-1234" })).toEqual(
    "/users/user-1234/comments",
  );

  expect(newUserCommentPath({ userId: "user-1234" })).toEqual(
    "/users/user-1234/comments/new",
  );

  expect(
    editUserCommentPath({ userId: "user-1234", id: "comment-1234" }),
  ).toEqual("/users/user-1234/comments/comment-1234/edit");
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
  expect(editSettingsPath({ format: "json" })).toEqual("/settings/edit.json");

  expect(editSettingsPath({ section: "security" })).toEqual(
    "/settings/edit/security",
  );

  expect(editSettingsPath({ section: "security", format: "json" })).toEqual(
    "/settings/edit/security.json",
  );
});

test("returns url with format", () => {
  expect(usersPath({ format: "json" })).toEqual("/users.json");
});

test("uses boolean as a parameter", () => {
  expect(togglePath({ value: false })).toEqual("/toggle/false");
  expect(togglePath({ value: true })).toEqual("/toggle/true");
});

test("uses number as a parameter", () => {
  expect(togglePath({ value: 0 })).toEqual("/toggle/0");
  expect(togglePath({ value: 1 })).toEqual("/toggle/1");
});

test("raises exception with invalid required segments", () => {
  expect(() => togglePath({ value: null })).toThrow(
    "value is required, but received null",
  );

  expect(() => togglePath({ value: undefined })).toThrow(
    "value is required, but received undefined",
  );

  expect(() => togglePath({ value: " " })).toThrow(
    'value is required, but received " "',
  );

  expect(() => togglePath({ value: [] })).toThrow(
    "value is required, but received []",
  );
});
