import { console } from "./lib/bootstrap";
import { JSRule } from "./lib/rules/rules";
import { TimerTrigger } from "./lib/rules/triggers";
import {
  statesAsNumber,
  now,
  getItem,
  stateEquals,
  sendCommand,
  pe,
} from "./lib/utils/helpers";

const TEMP_DELTA = 1;

enum ThreeState {
  True,
  False,
  Unknown
}

let startLoops = 2;

const isSolarPoolTime = () : ThreeState => {

  const hour: number = now().getHourOfDay();

  if (hour >= 8 && hour < 19) {
    console.log("Zwischen 8-19 Uhr");
    return ThreeState.True;
  }

  return ThreeState.False;
}

const executePoolSolarRule = () => {

  const Solar_Pump = getItem("Solar_Pump");

  if (isSolarPoolTime() === ThreeState.False) {
    if (stateEquals(Solar_Pump, ON)) {
      console.log("Stop, it is now to late for a solar pump");
      sendCommand(Solar_Pump, OFF);
    }

  } else {

    if (stateEquals(Solar_Pump, ON)) {
      console.log("Pump is running ...");

      statesAsNumber(["Pool_Temp", "Pool_TempIn"], ([tempPool, tempIn]) => {
        if (tempIn - tempPool >= TEMP_DELTA) {
          console.log("Temp Delta is larger than 2°C, let it run ...");
        } else {
          console.log("Temp Delta is smaller than 2°C, stop now ...");
          sendCommand(Solar_Pump, OFF);
        }
      });
    } else {
      console.log("Pump is stopped ...");

      if (startLoops >= 3) {
        console.log("Pump will be started ...");
        sendCommand(Solar_Pump, ON);
        startLoops = 0;
      } else {
        console.log("Pump must still wait ... " + startLoops);
        startLoops++;
      }
    }

  }
};

try {
  JSRule({
    name: "Pool Solar Pumpe",
    triggers: [TimerTrigger("0 0/10 * * * ?", "triggerName")],
    execute: executePoolSolarRule,
  });

  executePoolSolarRule();

} catch (e) {
  console.log("UPS!");
  console.log(e);
}
