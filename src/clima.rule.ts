import { logWarn, logDebug } from "./lib/bootstrap";
import { ChangedEventTrigger } from "./lib/rules/triggers";
import { JSRule } from "./lib/rules/rules";
import { getItem, stateAsNumber, postUpdate, isValidState } from "./lib/utils/helpers";

// #################################################################
// ##                         LOGIC                               ##
// #################################################################

const computeAbsoluteHumidity = (temp: number, humidity: number) => {
  const T = temp                                          /* Temperatur in °C */
  const r = humidity                                      /* relative Luftfeuchte */

  const R = 8314.3                                        /* J/(kmol*K) (universelle Gaskonstante) */
  const mw = 18.016                                       /* kg/kmol (Molekulargewicht des Wasserdampfes) */

  const a = T >= 0 ? 7.6 : 7.5                            /* Parameter über Wasser (Taupunkt) */
  const b = T >= 0 ? 237.3 : 240.7                        /* Parameter über Wasser (Taupunkt) */

  const TK = T + 273.15                                   /* Temperatur in Kelvin */
  const SDDT = 6.1078 * Math.pow(10, ((a * T) / (b + T))) /* Sättigungsdampfdruck in hPa */
  const DDrT = r / 100 * SDDT                             /* Dampfdruck in hPa */
  const AFrTK = Math.pow(10, 5) * mw / R * DDrT / TK      /* absolute Feuchte in g Wasserdampf pro m3 Luft */

  return Math.round(AFrTK * 100.0) / 100.0
}

const executeRule = (module: Action, input: TriggerValues<ItemStateChangedEvent>) => {
  try {

    let humName = input.event.getItemName().replace("Temperature", "Humidity");
    let humAbsName = input.event.getItemName().replace("Temperature", "AbsHumidity");

    const tempItem = getItem(input.event.getItemName());
    const humidityItem = getItem(humName);

    if(!isValidState(tempItem) || !isValidState(humidityItem)) {
      logDebug("clima", "Abs. Humidity for {} is wrong ...", input.event.getItemName());
      return;
    }

    const absHumidity = computeAbsoluteHumidity(stateAsNumber(tempItem), stateAsNumber(humidityItem))

    logDebug("clima", "Abs. Humidity {} {} at {}°C and {}%", input.event.getItemName(), absHumidity, stateAsNumber(tempItem), stateAsNumber(humidityItem));
    postUpdate(humAbsName, absHumidity);

  } catch (e) {
    logWarn("clima", e);
  }
}

// #################################################################
// ##                         RULES                               ##
// #################################################################

JSRule({
  name: "Compute Absolute Humidity",
  description: "Compute Absolute Humidity",
  triggers: [
    ChangedEventTrigger("Weather_Temperature"),
    ChangedEventTrigger("Temperature_Attic"),
    ChangedEventTrigger("Temperature_FF_Bath"),
    ChangedEventTrigger("Temperature_FF_Bed"),
    ChangedEventTrigger("Temperature_FF_Child"),
    ChangedEventTrigger("Temperature_FF_Office"),
    ChangedEventTrigger("Temperature_GF_Kitchen"),
    ChangedEventTrigger("Temperature_GF_Living"),
  ],
  execute: executeRule
});