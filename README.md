# Global Console Logger

## Description

Use winston logger as native console.log. You shouldn't have winston logger in your packages.

## How use

You should import this `global-console-logger` package only one time in your project.

Then just use your lovely `console.log`, `console.info`, `console.warn`, `console.error`.

```typescript
const logger = require('logger');

logger();

// info.log
console.log('It message show in console and info.log file');
console.info('It message show in console and info.log file');

// warn.log
console.warn('It message show in console and warn.log file');

// error.log
console.error('It message show in console and error.log file');
```

## Transport settings

```typescript
const logger = require('logger');

logger({ info: false, error: { maxFiles: 10, maxsize: 625000 } });
```

It disable logging into `info.log` and set max files count and max file size for `error.log` file.

### Default

By default `maxFiles = 2` and `maxsize = 5120000`

## Timezone settings

Use `process.env.TZ = 'Europe/Moscow'` for set timezone.

Locale setting:

```typescript
logger({ timeStamp: { locale: 'ru-RU' } });
```
