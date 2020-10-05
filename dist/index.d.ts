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
    trace?: boolean;
    timeStamp: {
        locale: string;
    };
};
declare function logger(settings?: consoleSettings): void;
export { logger };
