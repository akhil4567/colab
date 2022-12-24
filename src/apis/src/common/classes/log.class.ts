import { LogScheme } from "./log-scheme.class";

export class LogClass {

    info(...args: any): any {

        return LogScheme.info(args);
    }

    warn(...args: any): any {

        return LogScheme.warn(args);
    }

    error(...args: any): any {

        return LogScheme.error(args);
    }
}

export const log = new LogClass();