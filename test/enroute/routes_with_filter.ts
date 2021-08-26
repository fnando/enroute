/* eslint-disable */
// This file has been automatically generated.
// Don't edit it manually. Use `enroute export` instead.
// Last updated on 2021-08-26 17:26:45 UTC

import { zipObject } from "lodash";

function camelize(text: string): string {
  return text.replace(
    /_(.)/g,
    (_match, group) =>
      `${group[0].toUpperCase()}${group.substr(1, -1).toLowerCase()}`,
  );
}

function buildRoute(route: Route): RouteHandler {
  const incomingPattern = route.incomingPattern.replace("(.:format)", "");
  const outgoingPattern = route.outgoingPattern.replace("(.:format)", "");

  const handler = generate({
    ...route,
    segments: route.segments.map(camelize),
    requiredSegments: route.requiredSegments.map(camelize),
    pattern: incomingPattern,
  }) as RouteHandler;

  handler.pattern = incomingPattern;
  handler.incomingPattern = incomingPattern;
  handler.outgoingPattern = outgoingPattern;
  handler.underscore = generate({ ...route, pattern: outgoingPattern });

  return handler;
}

function generate(route: Route): RouteHelper {
  return (...args: PrimitiveType[]): string => {
    const { segments } = route;
    const pattern = route.pattern as string;
    const actualArgsSize = args.length;
    const requiredArgsSize = route.requiredSegments.length;
    const segmentsSize = segments.length;
    const params = zipObject(route.segments, args);

    if (actualArgsSize < requiredArgsSize) {
      throw new Error(
        `Expected ${requiredArgsSize} args; got ${actualArgsSize}`,
      );
    }

    if (actualArgsSize > segmentsSize) {
      throw new Error(
        `Expected no more than ${segmentsSize} args; got ${actualArgsSize}`,
      );
    }

    if (segmentsSize === 0) {
      return pattern;
    }

    const ext = params.format ? `.${params.format}` : "";
    const url = `${pattern}${ext}`;

    return segments.reduce((buffer: string, segment: string) => {
      const param = String(params[segment]);
      const encodedParam = encodeURIComponent(param);

      const optionalSegmentRegex = new RegExp(`\\(\\/:${segment}\\)`);
      const requiredSegmentRegex = new RegExp(`\\(?:${segment}\\)?`);

      if (buffer.match(optionalSegmentRegex)) {
        const replacement = params[segment] ? `/${encodedParam}` : "";
        return buffer.replace(optionalSegmentRegex, replacement);
      }

      const rejectParam =
        param === "undefined" ||
        param === "null" ||
        param.trim() === "";

      if (route.requiredSegments.includes(segment) && rejectParam) {
        const serializedParam = JSON.stringify(params[segment]);

        throw new Error(
          `${segment} is required, but received ${serializedParam}.`
        );
      }

      return buffer.replace(requiredSegmentRegex, encodedParam);
    }, url);
  };
}

export type PrimitiveType = number | string | null | undefined | boolean;
export type ArrayType = AnyObject[];
export type AnyObject = PrimitiveType | ArrayType | ObjectType | any;

export interface ObjectType {
  [key: string]: PrimitiveType | ArrayType | ObjectType;
}

export interface Route {
  name: string;
  typeName: string;
  pattern?: string;
  method: string[];
  segments: string[];
  requiredSegments: string[];
  incomingPattern: string;
  outgoingPattern: string;
}

export type RouteHelper = (...args: PrimitiveType[]) => string;

export type RouteHandler = RouteHelper & {
  pattern: string;
  incomingPattern: string;
  outgoingPattern: string;
  underscore: RouteHelper;
};

export interface RootRouteHandler extends RouteHandler {
  (): string;
}

export interface UserCommentsRouteHandler extends RouteHandler {
  (userId: any, format?: any): string;
}

export interface NewUserCommentRouteHandler extends RouteHandler {
  (userId: any, format?: any): string;
}

export interface EditUserCommentRouteHandler extends RouteHandler {
  (userId: any, id: any, format?: any): string;
}

export interface UserCommentRouteHandler extends RouteHandler {
  (userId: any, id: any, format?: any): string;
}

export interface UsersRouteHandler extends RouteHandler {
  (format?: any): string;
}

export interface NewUserRouteHandler extends RouteHandler {
  (format?: any): string;
}

export interface EditUserRouteHandler extends RouteHandler {
  (id: any, format?: any): string;
}

export interface UserRouteHandler extends RouteHandler {
  (id: any, format?: any): string;
}

export interface NewProfileRouteHandler extends RouteHandler {
  (format?: any): string;
}

export interface EditProfileRouteHandler extends RouteHandler {
  (format?: any): string;
}

export interface ProfileRouteHandler extends RouteHandler {
  (format?: any): string;
}

export interface LogoutRouteHandler extends RouteHandler {
  (format?: any): string;
}

export interface EditSettingsRouteHandler extends RouteHandler {
  (section?: any, format?: any): string;
}

export interface ToggleRouteHandler extends RouteHandler {
  (value: any, format?: any): string;
}


export const routes: Route[] = [
  {
    "name": "root",
    "typeName": "RootRouteHandler",
    "incomingPattern": "/",
    "outgoingPattern": "/",
    "method": [
      "get",
      "post",
      "patch",
      "put",
      "delete"
    ],
    "segments": [

    ],
    "requiredSegments": [

    ]
  },
  {
    "name": "userComments",
    "typeName": "UserCommentsRouteHandler",
    "incomingPattern": "/users/:userId/comments(.:format)",
    "outgoingPattern": "/users/:user_id/comments(.:format)",
    "method": [
      "get",
      "post",
      "patch",
      "put",
      "delete"
    ],
    "segments": [
      "user_id",
      "format"
    ],
    "requiredSegments": [
      "user_id"
    ]
  },
  {
    "name": "newUserComment",
    "typeName": "NewUserCommentRouteHandler",
    "incomingPattern": "/users/:userId/comments/new(.:format)",
    "outgoingPattern": "/users/:user_id/comments/new(.:format)",
    "method": [
      "get",
      "post",
      "patch",
      "put",
      "delete"
    ],
    "segments": [
      "user_id",
      "format"
    ],
    "requiredSegments": [
      "user_id"
    ]
  },
  {
    "name": "editUserComment",
    "typeName": "EditUserCommentRouteHandler",
    "incomingPattern": "/users/:userId/comments/:id/edit(.:format)",
    "outgoingPattern": "/users/:user_id/comments/:id/edit(.:format)",
    "method": [
      "get",
      "post",
      "patch",
      "put",
      "delete"
    ],
    "segments": [
      "user_id",
      "id",
      "format"
    ],
    "requiredSegments": [
      "user_id",
      "id"
    ]
  },
  {
    "name": "userComment",
    "typeName": "UserCommentRouteHandler",
    "incomingPattern": "/users/:userId/comments/:id(.:format)",
    "outgoingPattern": "/users/:user_id/comments/:id(.:format)",
    "method": [
      "get",
      "post",
      "patch",
      "put",
      "delete"
    ],
    "segments": [
      "user_id",
      "id",
      "format"
    ],
    "requiredSegments": [
      "user_id",
      "id"
    ]
  },
  {
    "name": "users",
    "typeName": "UsersRouteHandler",
    "incomingPattern": "/users(.:format)",
    "outgoingPattern": "/users(.:format)",
    "method": [
      "get",
      "post",
      "patch",
      "put",
      "delete"
    ],
    "segments": [
      "format"
    ],
    "requiredSegments": [

    ]
  },
  {
    "name": "newUser",
    "typeName": "NewUserRouteHandler",
    "incomingPattern": "/users/new(.:format)",
    "outgoingPattern": "/users/new(.:format)",
    "method": [
      "get",
      "post",
      "patch",
      "put",
      "delete"
    ],
    "segments": [
      "format"
    ],
    "requiredSegments": [

    ]
  },
  {
    "name": "editUser",
    "typeName": "EditUserRouteHandler",
    "incomingPattern": "/users/:id/edit(.:format)",
    "outgoingPattern": "/users/:id/edit(.:format)",
    "method": [
      "get",
      "post",
      "patch",
      "put",
      "delete"
    ],
    "segments": [
      "id",
      "format"
    ],
    "requiredSegments": [
      "id"
    ]
  },
  {
    "name": "user",
    "typeName": "UserRouteHandler",
    "incomingPattern": "/users/:id(.:format)",
    "outgoingPattern": "/users/:id(.:format)",
    "method": [
      "get",
      "post",
      "patch",
      "put",
      "delete"
    ],
    "segments": [
      "id",
      "format"
    ],
    "requiredSegments": [
      "id"
    ]
  },
  {
    "name": "newProfile",
    "typeName": "NewProfileRouteHandler",
    "incomingPattern": "/profile/new(.:format)",
    "outgoingPattern": "/profile/new(.:format)",
    "method": [
      "get",
      "post",
      "patch",
      "put",
      "delete"
    ],
    "segments": [
      "format"
    ],
    "requiredSegments": [

    ]
  },
  {
    "name": "editProfile",
    "typeName": "EditProfileRouteHandler",
    "incomingPattern": "/profile/edit(.:format)",
    "outgoingPattern": "/profile/edit(.:format)",
    "method": [
      "get",
      "post",
      "patch",
      "put",
      "delete"
    ],
    "segments": [
      "format"
    ],
    "requiredSegments": [

    ]
  },
  {
    "name": "profile",
    "typeName": "ProfileRouteHandler",
    "incomingPattern": "/profile(.:format)",
    "outgoingPattern": "/profile(.:format)",
    "method": [
      "get",
      "post",
      "patch",
      "put",
      "delete"
    ],
    "segments": [
      "format"
    ],
    "requiredSegments": [

    ]
  },
  {
    "name": "logout",
    "typeName": "LogoutRouteHandler",
    "incomingPattern": "/logout(.:format)",
    "outgoingPattern": "/logout(.:format)",
    "method": [
      "get",
      "post",
      "patch",
      "put",
      "delete"
    ],
    "segments": [
      "format"
    ],
    "requiredSegments": [

    ]
  },
  {
    "name": "editSettings",
    "typeName": "EditSettingsRouteHandler",
    "incomingPattern": "/settings/edit(/:section)(.:format)",
    "outgoingPattern": "/settings/edit(/:section)(.:format)",
    "method": [
      "get",
      "post",
      "patch",
      "put",
      "delete"
    ],
    "segments": [
      "section",
      "format"
    ],
    "requiredSegments": [

    ]
  },
  {
    "name": "toggle",
    "typeName": "ToggleRouteHandler",
    "incomingPattern": "/toggle/:value(.:format)",
    "outgoingPattern": "/toggle/:value(.:format)",
    "method": [
      "get",
      "post",
      "patch",
      "put",
      "delete"
    ],
    "segments": [
      "value",
      "format"
    ],
    "requiredSegments": [
      "value"
    ]
  }
];

export const routeHandlers: RouteHandler[] = [
  buildRoute(routes[0]) as RootRouteHandler,
  buildRoute(routes[1]) as UserCommentsRouteHandler,
  buildRoute(routes[2]) as NewUserCommentRouteHandler,
  buildRoute(routes[3]) as EditUserCommentRouteHandler,
  buildRoute(routes[4]) as UserCommentRouteHandler,
  buildRoute(routes[5]) as UsersRouteHandler,
  buildRoute(routes[6]) as NewUserRouteHandler,
  buildRoute(routes[7]) as EditUserRouteHandler,
  buildRoute(routes[8]) as UserRouteHandler,
  buildRoute(routes[9]) as NewProfileRouteHandler,
  buildRoute(routes[10]) as EditProfileRouteHandler,
  buildRoute(routes[11]) as ProfileRouteHandler,
  buildRoute(routes[12]) as LogoutRouteHandler,
  buildRoute(routes[13]) as EditSettingsRouteHandler,
  buildRoute(routes[14]) as ToggleRouteHandler,
];

export const rootUrl = (): string =>
  routeHandlers[0]();

export const userCommentsUrl = (userId: any, format?: any): string =>
  routeHandlers[1](userId, format);

export const newUserCommentUrl = (userId: any, format?: any): string =>
  routeHandlers[2](userId, format);

export const editUserCommentUrl = (userId: any, id: any, format?: any): string =>
  routeHandlers[3](userId, id, format);

export const userCommentUrl = (userId: any, id: any, format?: any): string =>
  routeHandlers[4](userId, id, format);

export const usersUrl = (format?: any): string =>
  routeHandlers[5](format);

export const newUserUrl = (format?: any): string =>
  routeHandlers[6](format);

export const editUserUrl = (id: any, format?: any): string =>
  routeHandlers[7](id, format);

export const userUrl = (id: any, format?: any): string =>
  routeHandlers[8](id, format);

export const newProfileUrl = (format?: any): string =>
  routeHandlers[9](format);

export const editProfileUrl = (format?: any): string =>
  routeHandlers[10](format);

export const profileUrl = (format?: any): string =>
  routeHandlers[11](format);

export const logoutUrl = (format?: any): string =>
  routeHandlers[12](format);

export const editSettingsUrl = (section?: any, format?: any): string =>
  routeHandlers[13](section, format);

export const toggleUrl = (value: any, format?: any): string =>
  routeHandlers[14](value, format);
