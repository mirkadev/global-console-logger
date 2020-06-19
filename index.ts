/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable no-proto */
/* eslint-disable no-shadow */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { Logger, createLogger, format, transports } from 'winston';

type consoleSettings = {
  info?:
    | {
        maxFiles: number;
        maxsize: number;
      }
    | boolean;
  warn?:
    | {
        maxFiles: number;
        maxsize: number;
      }
    | boolean;
  error?:
    | {
        maxFiles: number;
        maxsize: number;
      }
    | boolean;
  trace?: boolean;
  timeStamp: {
    locale: string;
  };
};

/**
 *
 * @param settings {object}
 * @returns {void} changed console methods
 */

export default function (settings?: consoleSettings): void {
  const printer = (data) => {
    process.stdout.write(`${data}\n`);
  };

  const printCls = (...data) => {
    data.forEach((d) => {
      if (Array.isArray(d)) {
        const res = `Array => [${d}]`;
        printer(res);
        return;
      }

      if (d instanceof Set) {
        const res = `Set(${d.size}) { ${[...d.keys()]} }`;
        return printer(res);
      }

      if (d instanceof Map) {
        const keys = [...d.keys()];
        const values = [...d.values()];

        let str = '';

        keys.forEach((k, i) => {
          const done = `${k} => ${values[i]}`;
          str = str.concat(`${i ? ', ' : ''}${done}`);
        });

        const res = `Map(${d.size}) { ${str} }`;
        return printer(res);
      }

      if (d instanceof Error) {
        return printer(
          `\nError (${d.name}) => ${d.message}\nStack => ${d.stack}\n`,
        );
      }

      if (d !== null && typeof d === 'object') {
        let json = '';

        try {
          json = JSON.stringify(d);
        } catch (error) {
          return printer(d);
        }
        const res = `${d.__proto__.constructor.name} => ${json}`;
        return printer(res);
      }

      printer(d);
    });
  };

  if (
    settings?.error !== false ||
    settings?.info !== false ||
    settings?.warn !== false
  ) {
    const { combine, printf, ms } = format;
    const self = printf(({ level, message, ms }) => {
      return `=> ${getDateTime(
        settings?.timeStamp.locale,
      )} ${ms} ${level}: ${message}`;
    });

    const transportsList: Array<any> = [];

    if (settings?.error && typeof settings?.error !== 'boolean') {
      const transport = new transports.File({
        filename: 'error.log',
        level: 'error',
        maxFiles: settings?.error.maxFiles,
        maxsize: settings?.error.maxsize,
      });

      transportsList.push(transport);
    } else {
      const transport = new transports.File({
        filename: 'error.log',
        level: 'error',
        maxFiles: 2,
        maxsize: 5120000,
      });

      transportsList.push(transport);
    }

    if (settings?.info && typeof settings?.info !== 'boolean') {
      const transport = new transports.File({
        filename: 'info.log',
        level: 'info',
        maxFiles: settings?.info.maxFiles,
        maxsize: settings?.info.maxsize,
      });

      transportsList.push(transport);
    } else {
      const transport = new transports.File({
        filename: 'info.log',
        level: 'info',
        maxFiles: 2,
        maxsize: 5120000,
      });

      transportsList.push(transport);
    }

    if (settings?.warn && typeof settings?.warn !== 'boolean') {
      const transport = new transports.File({
        filename: 'warn.log',
        level: 'warn',
        maxFiles: settings?.warn.maxFiles,
        maxsize: settings?.warn.maxsize,
      });

      transportsList.push(transport);
    } else {
      const transport = new transports.File({
        filename: 'warn.log',
        level: 'warn',
        maxFiles: 2,
        maxsize: 5120000,
      });

      transportsList.push(transport);
    }

    const logger: Logger = createLogger({
      format: combine(ms(), self),
      transports: transportsList,
    });

    if (settings?.info !== false) {
      globalThis.console.info = (...logs) => {
        logs.forEach((logData) => {
          logger.log({
            level: 'info',
            message:
              logData instanceof Error
                ? `${logData}\n${logData.stack || 'no stack'}`
                : logData,
          });
          printCls(logData);
        });
      };
    }

    if (settings?.warn !== false) {
      globalThis.console.warn = (...logs) => {
        logs.forEach((logData) => {
          logger.log({
            level: 'warn',
            message:
              logData instanceof Error
                ? `${logData}\n${logData.stack || 'no stack'}`
                : logData,
          });
          printCls(logData);
        });
      };
    }

    if (settings?.error !== false) {
      globalThis.console.error = (...logs) => {
        logs.forEach((logData) => {
          logger.log({
            level: 'error',
            message:
              logData instanceof Error
                ? `${logData}\n${logData.stack || 'no stack'}`
                : logData,
          });
          printCls(logData);
        });
      };
    }
    globalThis.console.info(
      `console-logger: now you have winston logger in your global console object`,
    );
  }
}

function getDateTime(locale = 'ru-RU'): string {
  process.env.TZ = process.env.TZ || 'Europe/Moscow';

  const date = new Date();
  const dateString = date.toLocaleString(locale);

  return dateString;
}
