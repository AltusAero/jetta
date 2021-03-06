### jetta.PublicSuffix `CLASS` extends `EventEmitter`
  - A [public suffix list](https://en.wikipedia.org/wiki/Public_Suffix_List) useful for looking up TLDs and eTLDs
  - Automatically updates from provided sources (uses open source sources by default)
  - Example:
  ```js
  const ps = new jetta.PublicSuffix()
  ```

  - _static_ jetta.PublicSuffix.keysToDestroy OBJECT
    - The names of keys that will be assigned to `null` when an `jetta.PublicSuffix` instance uses their `destroy` method

    - _return_ OBJECT<`name`, true>

  - _new_ jetta.PublicSuffix([`options` OBJECT])
    - All options are optional (defaults can be found in `jetta.defaults.publicSuffix`)
    - Prepares an immediate update upon creation under the following cases:
      - if `options.list` is used, but is an empty string
      - if path (provided by the `options.path`) does not exist or is outdated

    - `options` OBJECT _optional_
      - `cacheLimit` INTEGER | INFINITY - the limit, in milliseconds, before automatically refreshing the public suffix lists from sources
        - Set to `Infinity` to never refresh, thus disabling automatic updates
      - `lastUpdated` DATE | INTEGER - the date or time (in milliseconds) when the public suffix list has been updated
        - This is overwritten when reading from file from `options.path`
        - Handy for when using `options.list`
      - `list` STRING | `null` - an initializing public suffix list
        - If this option is used (is a string) the `options.path` will be ignored
        - If this option is used, but is an empty string, an update will be prepared to generate the list
        - Useful for the following use cases:
          - Environments where the file system is unavailable
          - Want to setup a temporary public suffix w/ an immediate 'ready' event
      - `path` STRING | url.URL - a path to store the public suffix list
        - If used, will write to path on updates and read from to file upon initializing the instance (if it exists)
        - Using this will update the instance's internal list upon updates
        - Can be a string or WHATWG URL object w/ `file:` protocol
      - `preferredErrorLanguage` OBJECT - as an [ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
        - Used as the default for all methods
        - See `jetta.JettaError` for details
      - `sources` ARRAY<OBJECT|STRING> - a list of sources, in preferred order, to refresh the public suffix from when updating
        - Each source should be compatible with `jetta.request`, which includes local `file:` URLs
        - Tries each source in preferred order, falling to the next source if an error occurs with it
        - No errors are emitted if a single source is available, but emitted when no sources are available
        - By default jetta uses [publicsuffix.org](https://publicsuffix.org/) and their [source from GitHub](https://github.com/publicsuffix/list). Please respect their bandwidth wishes by not updating [too frequently](https://publicsuffix.org/list/).

    - _instance_ OBJECT
      - Should wait for 'ready' event, unless being used exclusively with `jetta.CookieManager` (the instance will wait on it for you)
      - Should call `destroy` when finished or when you plan on exiting the process
        - If using with `jetta.CookieManager` see the [`destroy`](./cookie-manager.md) method there.
      - Inherits `options` passed to the instance.
        - The `list` property in the instance is the public suffix list as a string, regardless if `options.list` has been used or not during it's creation. This way one can copy or export the public suffix list manually.
      - Options for all methods can be found at [cookie-options.md](cookie-options.md)

      - Events
        - 'ready' - when ready to use (a public suffix list has been processed and made available)
        - 'error' (_instanceof_ `jetta.JettaError`)
        - 'updatedPublicSuffix' - when the public suffix list has been updated from sources

      - `destroy` () - effectively destroys the `jetta.publicSuffix` instance and cancels any pending updates
      - `isPublicSuffix` (`hostname` STRING) - checks if `hostname` is a public suffix
        - Example:
          ```js
          ps.isPublicSuffix('com') // true
          ps.isPublicSuffix('uk.com') // true
          ps.isPublicSuffix('example.kawasaki.jp') // true
          ps.isPublicSuffix('city.kawasaki.jp') // false
          ps.isPublicSuffix('altusaero.com') // false
          ```

        - _return_ BOOLEAN
      - `updateFromSources` () - updates public suffix list from sources
        - Can be used to manually update from sources and reset the `updateTimeout`
      - `updateTimeout` TIMEOUT | `null` - the `timeout` object for the next `updateFromSources`
        - `null` if `cacheLimit` is `Infinity`
      - `updating` BOOLEAN - denotes if the instance is currently updating
