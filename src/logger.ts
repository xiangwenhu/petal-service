import { env } from "./env";

const noop = function () {};

const emptyLog = {
    debug: noop,
    log: noop,
    info: noop,
    warn: noop,
    error: noop,
};

function getLogger(enabled: boolean) {
    if (enabled) {
        return console;
    }
    return emptyLog;
}

export default getLogger;
