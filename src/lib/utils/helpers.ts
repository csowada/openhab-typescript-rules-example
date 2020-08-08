import { nativeJSArray } from "../bootstrap";

type ItemNameOrItem = string | GenericItem;
type ReturnItemsMap<T extends string> = {[K in T]: GenericItem};

type DateTimeX = any;

export var DateTime: DateTimeX = Java.type("org.joda.time.DateTime");
export var pe: PersistenceExtensions = Java.type("org.eclipse.smarthome.model.persistence.extensions.PersistenceExtensions");

export const now = (): DateTimeX => {
  return DateTime.now();
};

export const handleError = (logger: any, e: any) => {
  try {
    logger.error("ERROR!");
    logger.error(e);

    if (e.stack) logger.error("Stack: " + e.stack);
    if (e.lineNumber) logger.error("Line:" + e.lineNumber);
    if (e.columnNumber) logger.error("Column: "+ e.columnNumber);
    if (e.fileName) logger.error("File: " + e.fileName);

    if(e.getStackTrace) {
      const g = nativeJSArray(e.getStackTrace());
      logger.error("STACKTRACE:\n" + g.join("\n"));
    }

  } catch(e) {
    logger.error("Error on error handler, haaaa");
  }


}

/**
 * Posts a status update for a specified item to the event bus.
 * @param item 
 * @param value 
 */
export const postUpdate = (item: ItemNameOrItem, value: string | number | State): void => {
  let itm = getItem(item);
  if (itm) {
    if (typeof value === "string") {
      events.postUpdate(itm, value as string);
    } else if (typeof value === "number") {
      events.postUpdate(itm, value as number);
    } else {
      events.postUpdate(itm, value as State);
    }
  }
}

/**
 * 
 * @param item 
 * @param value 
 */
export const sendCommand = (item: ItemNameOrItem, value: string | number | Command): void => {
  let itm = getItem(item);
  if (itm) {
    if (typeof value === "string") {
      events.sendCommand(itm, value as string);
    } else if (typeof value === "number") {
      events.sendCommand(itm, value as number);
    } else {
      events.sendCommand(itm, value as Command);
    }
  }
}

/**
 * 
 * @param item 
 */
export const isValidState = (item: ItemNameOrItem): boolean => {

  const itm = getItem(item);
  if (itm && itm.getState() !== UNDEF && itm.getState() !== NULL) {
    return true;
  };

  return false;
}

/**
 * 
 * @param itemNames 
 */
export const getItems = <T extends string>(...itemNames: T[]): ReturnItemsMap<T> => {
  return itemNames.reduce((oldType: ReturnItemsMap<T>, type) => ({ ...oldType, [type]: getItem(type) }), {} as ReturnItemsMap<T>)
}

/**
 * 
 * @param item 
 * @param callback 
 */
export const getItem = (item: ItemNameOrItem, callback?: (item: GenericItem) => void): GenericItem | null => {

  let itm: GenericItem | null;

  if (typeof item == "string") {
    try {
      itm = ir.getItem(item);

    } catch (e) {
      itm = null;
    }
  } else {
    itm = item;
  }

  if (callback && itm) {
    callback(itm);
  }

  return itm;
}

/**
 * 
 * @param itemName 
 * @param callback 
 */
export const stateAsString = (itemName: ItemNameOrItem, callback?: (value: string) => void): string | null => {

  let item = getItem(itemName);
  if (item) {
    let state = item.getState();
    if (state instanceof StringType) {
      let v = state.toFullString();

      if (callback) {
        callback(v);
      }
      return v;
    }
  };

  return null;
}

export const stateEquals = (itemName: ItemNameOrItem | null, value: any) => {

  if(itemName == null) {
    return false;
  }

  if (typeof value == "number") {
    return stateAsNumber(itemName) == value;

  } else if (typeof value == "string") {
    return stateAsString(itemName) == value;
    
  } else {
    let item = getItem(itemName);
    if (item) {
      return item.getState() === value;
    }
  }

  return false;
}

/**
 * 
 * @param itemName 
 * @param callback 
 */
export const stateAsNumber = (itemName: ItemNameOrItem, callback?: (value: number) => void): number => {

  let item = getItem(itemName);
  if (item) {
    let state = item.getState();
    if (state instanceof DecimalType) {
      let v = state.toBigDecimal();

      if (callback) {
        callback(v);
      }

      return v;
    }
  };

  return NaN;
}



export const statesAsNumber = (itemNames: ItemNameOrItem[], callback: (values: number[]) => void): void => {

  const results = [];

  itemNames.forEach(element => {
    const v = stateAsNumber(element);
    if(isNaN(v)) {
      return;
    }

    results.push(v);
  });

  callback(results);
}

/**
 * 
 * @param itemName 
 * @param callback 
 */
export const stateAsCalendar = (itemName: ItemNameOrItem, callback?: (value: Calendar) => void): Calendar | null => {

  let item = getItem(itemName);
  if (item) {
    let state = item.getState();
    if (state instanceof DateTimeType) {
      let v = state.getCalendar();

      if (callback) {
        if (v) {
          callback(v);
        }
      }

      return v;
    }
  };

  return null;
}