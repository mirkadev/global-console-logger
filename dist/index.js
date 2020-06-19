"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
function default_1(settings) {
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
                return printer(`\nError (${d.name}) => ${d.message}\nStack => ${d.stack}\n`);
            }
            if (d !== null && typeof d === 'object') {
                let json = '';
                try {
                    json = JSON.stringify(d);
                }
                catch (error) {
                    return printer(d);
                }
                const res = `${d.__proto__.constructor.name} => ${json}`;
                return printer(res);
            }
            printer(d);
        });
    };
    if ((settings === null || settings === void 0 ? void 0 : settings.error) !== false ||
        (settings === null || settings === void 0 ? void 0 : settings.info) !== false ||
        (settings === null || settings === void 0 ? void 0 : settings.warn) !== false) {
        const { combine, printf, ms } = winston_1.format;
        const self = printf(({ level, message, ms }) => {
            return `=> ${getDateTime(settings === null || settings === void 0 ? void 0 : settings.timeStamp.locale)} ${ms} ${level}: ${message}`;
        });
        const transportsList = [];
        if ((settings === null || settings === void 0 ? void 0 : settings.error) && typeof (settings === null || settings === void 0 ? void 0 : settings.error) !== 'boolean') {
            const transport = new winston_1.transports.File({
                filename: 'error.log',
                level: 'error',
                maxFiles: settings === null || settings === void 0 ? void 0 : settings.error.maxFiles,
                maxsize: settings === null || settings === void 0 ? void 0 : settings.error.maxsize,
            });
            transportsList.push(transport);
        }
        else {
            const transport = new winston_1.transports.File({
                filename: 'error.log',
                level: 'error',
                maxFiles: 2,
                maxsize: 5120000,
            });
            transportsList.push(transport);
        }
        if ((settings === null || settings === void 0 ? void 0 : settings.info) && typeof (settings === null || settings === void 0 ? void 0 : settings.info) !== 'boolean') {
            const transport = new winston_1.transports.File({
                filename: 'info.log',
                level: 'info',
                maxFiles: settings === null || settings === void 0 ? void 0 : settings.info.maxFiles,
                maxsize: settings === null || settings === void 0 ? void 0 : settings.info.maxsize,
            });
            transportsList.push(transport);
        }
        else {
            const transport = new winston_1.transports.File({
                filename: 'info.log',
                level: 'info',
                maxFiles: 2,
                maxsize: 5120000,
            });
            transportsList.push(transport);
        }
        if ((settings === null || settings === void 0 ? void 0 : settings.warn) && typeof (settings === null || settings === void 0 ? void 0 : settings.warn) !== 'boolean') {
            const transport = new winston_1.transports.File({
                filename: 'warn.log',
                level: 'warn',
                maxFiles: settings === null || settings === void 0 ? void 0 : settings.warn.maxFiles,
                maxsize: settings === null || settings === void 0 ? void 0 : settings.warn.maxsize,
            });
            transportsList.push(transport);
        }
        else {
            const transport = new winston_1.transports.File({
                filename: 'warn.log',
                level: 'warn',
                maxFiles: 2,
                maxsize: 5120000,
            });
            transportsList.push(transport);
        }
        const logger = winston_1.createLogger({
            format: combine(ms(), self),
            transports: transportsList,
        });
        if ((settings === null || settings === void 0 ? void 0 : settings.info) !== false) {
            globalThis.console.info = (...logs) => {
                logs.forEach((logData) => {
                    logger.log({
                        level: 'info',
                        message: logData instanceof Error
                            ? `${logData}\n${logData.stack || 'no stack'}`
                            : logData,
                    });
                    printCls(logData);
                });
            };
        }
        if ((settings === null || settings === void 0 ? void 0 : settings.warn) !== false) {
            globalThis.console.warn = (...logs) => {
                logs.forEach((logData) => {
                    logger.log({
                        level: 'warn',
                        message: logData instanceof Error
                            ? `${logData}\n${logData.stack || 'no stack'}`
                            : logData,
                    });
                    printCls(logData);
                });
            };
        }
        if ((settings === null || settings === void 0 ? void 0 : settings.error) !== false) {
            globalThis.console.error = (...logs) => {
                logs.forEach((logData) => {
                    logger.log({
                        level: 'error',
                        message: logData instanceof Error
                            ? `${logData}\n${logData.stack || 'no stack'}`
                            : logData,
                    });
                    printCls(logData);
                });
            };
        }
        globalThis.console.info(`console-logger: now you have winston logger in your global console object`);
    }
}
exports.default = default_1;
function getDateTime(locale = 'ru-RU') {
    process.env.TZ = process.env.TZ || 'Europe/Moscow';
    const date = new Date();
    const dateString = date.toLocaleString(locale);
    return dateString;
}
//# sourceMappingURL=index.js.map