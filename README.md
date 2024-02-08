# Enroute

Generates a TypeScript file that defines all named routes from Rails as helper
functions.

[![Tests](https://github.com/fnando/enroute/workflows/tests/badge.svg)](https://github.com/fnando/enroute)
[![Gem](https://img.shields.io/gem/v/enroute.svg)](https://rubygems.org/gems/enroute)
[![Gem](https://img.shields.io/gem/dt/enroute.svg)](https://rubygems.org/gems/enroute)

## Installation

Add this line to your application's Gemfile:

```ruby
gem "enroute"
```

And then execute:

    $ bundle install

Or install it yourself as:

    $ gem install enroute

## Usage

All you have to do is call the `enroute` binary with the main file you want to
load and a output path.

```console
$ bundle exec enroute export --output ./app/frontend/scripts/config/routes.ts
```

By default, `<pwd>/config/environment.rb` will be loaded. If you want to use a
different file, use the `--require` switch.

```console
$ bundle exec enroute export --require ./different-file.rb --output ./routes.ts
```

You can also ignore routes by using a config file.

```console
$ bundle exec enroute export --output ./app/frontend/scripts/config/routes.ts --config ./config/enroute.yml
```

The config file must look like this:

```yaml
---
ignore:
  - route_name
```

There's also a `:only` option that will include only the matching named routes.

```yaml
---
only:
  - route_name
```

By default, route params will be typed as `any`. To add a custom typing
annotation, you can use the `typings` key on the configuration file. Imagine you
have the route `get "settings/edit(/:section)" => "", as: "edit_settings"`; you
can have a config file like this:

```yaml
---
typings:
  _default:
    format: '"html" | "json"'

  edit_settings:
    section: string
```

### Importing helpers on TypeScript

You can then import any route that's been exported. Parameters are positional.

```typescript
import { userUrl } from "./routes";

userUrl({ id: 1234 });
//=> "/users/1234"

userUrl({ id: 1234, format: "json" });
//=> "/users/1234.json"
```

You can also have routes with optional segments. For instance, imagine you have
define the route `get "settings/edit(/:section)" => "", as: "edit_settings"`.
You could then use the helper `editSettingsUrl()` like this:

```typescript
import { editSettingsUrl } from "./routes";

editSettingsUrl();
//=> "/settings/edit"

editSettingsUrl({ section: "security" });
//=> "/settings/edit/security"
```

All helpers are typed accordingly to the route definition. For convenience, you
may pass any primitives as a url parameter, which will then be converted into
string.

An exception will be raised if you forget to provide a required parameter; empty
strings, `null` and `undefined` will be rejected, but `false` is accepted.

```typescript
import { userUrl } from "./routes";

userUrl();
//=> raises `id is required, but received undefined`
```

## Maintainer

- [Nando Vieira](https://github.com/fnando)

## Contributors

- https://github.com/fnando/enroute/contributors

## Contributing

For more details about how to contribute, please read
https://github.com/fnando/enroute/blob/main/CONTRIBUTING.md.

## License

The gem is available as open source under the terms of the
[MIT License](https://opensource.org/licenses/MIT). A copy of the license can be
found at https://github.com/fnando/enroute/blob/main/LICENSE.md.

## Code of Conduct

Everyone interacting in the enroute project's codebases, issue trackers, chat
rooms and mailing lists is expected to follow the
[code of conduct](https://github.com/fnando/enroute/blob/main/CODE_OF_CONDUCT.md).
