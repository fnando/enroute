# Enroute

Generates a TypeScript file that defines all named routes from Rails as helper
functions.

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

userUrl(1234);
//=> "/users/1234"

userUrl(1234, "json");
//=> "/users/1234.json"
```

You can also have routes with optional segments. For instance, imagine you have
define the route `get "settings/edit(/:section)" => "", as: "edit_settings"`.
You could then use the helper `editSettingsUrl()` like this:

```typescript
import { editSettingsUrl } from "./routes";

editSettingsUrl();
//=> "/settings/edit"

editSettingsUrl("security");
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

## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run
`rake test` to run the tests. You can also run `bin/console` for an interactive
prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To
release a new version, update the version number in `version.rb`, and then run
`bundle exec rake release`, which will create a git tag for the version, push
git commits and tags, and push the `.gem` file to
[rubygems.org](https://rubygems.org).

## Contributing

Bug reports and pull requests are welcome on GitHub at
https://github.com/fnando/enroute. This project is intended to be a safe,
welcoming space for collaboration, and contributors are expected to adhere to
the
[code of conduct](https://github.com/fnando/enroute/blob/master/CODE_OF_CONDUCT.md).

## License

The gem is available as open source under the terms of the
[MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Enroute project's codebases, issue trackers, chat
rooms and mailing lists is expected to follow the
[code of conduct](https://github.com/fnando/enroute/blob/master/CODE_OF_CONDUCT.md).
