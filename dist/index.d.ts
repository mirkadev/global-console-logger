declare type consoleSettings = {
    info?: {
        maxFiles: number;
        maxsize: number;
    } | boolean;
    warn?: {
        maxFiles: number;
        maxsize: number;
    } | boolean;
    error?: {
        maxFiles: number;
        maxsize: number;
    } | boolean;
    trace: boolean;
};
export default function (cons: globalThis.Console, settings: consoleSettings): globalThis.Console;
export {};
