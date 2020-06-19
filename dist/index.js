"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
function default_1(settings) {
    const successLog = globalThis.console.log;
    const infoLog = globalThis.console.info;
    const warnLog = globalThis.console.warn;
    const errorLog = globalThis.console.error;
    const trace = globalThis.console.trace;
    if (settings === null || settings === void 0 ? void 0 : settings.trace) {
        globalThis.console.trace = (...logs) => {
            logs.forEach((logData) => {
                const label = Math.random().toString(16).slice(-3);
                successLog(`=> TRACE:START:${label}`);
                trace();
                successLog(`-> ${logData}`);
                successLog(`<= END:${label}`);
            });
        };
    }
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
            globalThis.console.info = globalThis.console.log = (...logs) => {
                logs.forEach((logData) => {
                    logger.log({
                        level: 'info',
                        message: logData instanceof Error
                            ? `${logData}\n${logData.stack || 'no stack'}`
                            : logData,
                    });
                    infoLog(logData);
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
                    warnLog(logData);
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
                    errorLog(logData);
                });
            };
        }
        globalThis.console.info(`console-logger: now you have winston-logger in your global console function`);
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