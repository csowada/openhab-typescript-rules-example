export var logFactory = Java.type("org.slf4j.LoggerFactory")
export var logger = logFactory.getLogger("org.openhab.rule");

export var console = {
  log: function (msg: string, ...args: any[]) {
    logger.info(msg, args);
  },
  error: function (msg: string, ...args: any[]) {
    logger.error(msg, args);
  }
};

export function print(msg: string) {
  // new
  logger.info(msg);
}

export function logInfo(source: string, msg: string, ...obj: any[]) {
  const localLogger = logFactory.getLogger("org.openhab.js.rule." + source);
  localLogger.info(msg, obj);
}

export function logWarn(source: string, msg: string, ...obj: any[]) {
  const localLogger = logFactory.getLogger("org.openhab.js.rule." + source);
  localLogger.warn(msg, obj);
}

export function logDebug(source: string, msg: string, ...obj: any[]) {
  const localLogger = logFactory.getLogger("org.openhab.js.rule." + source);
  localLogger.debug(msg, obj);
}

export const nativeJSArray = <T>(array: T[]): T[] => {
  return Java.from(array) as T[];
}