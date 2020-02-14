import {
  editProfileUrl,
  editSettingsUrl,
  editUserCommentUrl,
  editUserUrl,
  loginUrl,
  logoutUrl,
  newProfileUrl,
  newUserCommentUrl,
  newUserUrl,
  profileUrl,
  rootUrl,
  toggleUrl,
  userCommentsUrl,
  usersUrl,
} from "./routes";

test("returns root url", () => {
  expect(rootUrl()).toEqual("/");
});

test("returns urls for `resources :users`", () => {
  expect(usersUrl()).toEqual("/users");
  expect(editUserUrl("user-1234")).toEqual("/users/user-1234/edit");
  expect(newUserUrl()).toEqual("/users/new");
});

test("returns urls for nested resource", () => {
  expect(userCommentsUrl("user-1234")).toEqual("/users/user-1234/comments");
  expect(newUserCommentUrl("user-1234")).toEqual(
    "/users/user-1234/comments/new",
  );
  expect(editUserCommentUrl("user-1234", "comment-1234")).toEqual(
    "/users/user-1234/comments/comment-1234/edit",
  );
});

test("returns urls for `resource :profile`", () => {
  expect(profileUrl()).toEqual("/profile");
  expect(newProfileUrl()).toEqual("/profile/new");
  expect(editProfileUrl()).toEqual("/profile/edit");
});

test("returns url for verb routes", () => {
  expect(loginUrl()).toEqual("/login");
  expect(logoutUrl()).toEqual("/logout");
});

test("returns url for optional segment", () => {
  expect(editSettingsUrl()).toEqual("/settings/edit");
  expect(editSettingsUrl(null, "json")).toEqual("/settings/edit.json");
  expect(editSettingsUrl("security")).toEqual("/settings/edit/security");
  expect(editSettingsUrl("security", "json")).toEqual(
    "/settings/edit/security.json",
  );
});

test("returns url with format", () => {
  expect(usersUrl("json")).toEqual("/users.json");
});

test("uses boolean as a parameter", () => {
  expect(toggleUrl(false)).toEqual("/toggle/false");
  expect(toggleUrl(true)).toEqual("/toggle/true");
});

test("uses number as a parameter", () => {
  expect(toggleUrl(0)).toEqual("/toggle/0");
  expect(toggleUrl(1)).toEqual("/toggle/1");
});

test("raises exception with invalid required segments", () => {
  expect(() => toggleUrl(null)).toThrow("value is required, but received null");

  expect(() => toggleUrl(undefined)).toThrow(
    "value is required, but received undefined",
  );

  expect(() => toggleUrl(" ")).toThrow('value is required, but received " "');
  expect(() => toggleUrl([])).toThrow("value is required, but received []");
});
