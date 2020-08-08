import { console, logWarn } from "./lib/bootstrap";
import { stateAsNumber, stateEquals, postUpdate } from "./lib/utils/helpers";
import { JSRule } from "./lib/rules/rules";
import { TimerTrigger, ChangedEventTrigger } from "./lib/rules/triggers";

// #################################################################
// ##                         LOGIC                               ##
// #################################################################

const executeSolarDelta = () => {

  const collTemp = stateAsNumber('SOL_Temp_Collector');
  const retTemp = stateAsNumber('SOL_Temp_Return');

  if (!isNaN(collTemp) && !isNaN(retTemp)) {
    const delta = collTemp - retTemp;
    postUpdate('SOL_Temp_Delta', delta > 0 ? delta : 0);
  }
}

const executeSolarStagRule = () => {

  const collTemp = stateAsNumber('SOL_Temp_Collector');
  const dhwTemp = stateAsNumber('HU_Temp_Warm_Wather');

  if (!isNaN(collTemp) && !isNaN(dhwTemp)) {
    if (collTemp > 130 && dhwTemp <= 60) {
      logWarn("CLIMA", "Solarkollktoren ({}°C) überhizen ohne aufgeheizten Boiler ({}°C) !", collTemp, dhwTemp)

      if (stateEquals('SOL_Stagnation_Alarm', OFF)) {
        postUpdate('SOL_Stagnation_Alarm', ON);
      }
    }
  }
}

const executeSolarStagReset = () => {
  if (stateEquals('SOL_Stagnation_Alarm', ON)) {
    postUpdate('SOL_Stagnation_Alarm', OFF);

  } else if (stateEquals('SOL_Stagnation_Alarm', UNDEF)) {
    postUpdate('SOL_Stagnation_Alarm', OFF);
  }
}



// #################################################################
// ##                         RULES                               ##
// #################################################################

try {
  JSRule({
    name: "Solar Temparatur Delta",
    triggers: [
      ChangedEventTrigger("SOL_Temp_Collector"),
      ChangedEventTrigger("SOL_Temp_Return"),
    ],
    execute: executeSolarDelta
  });

  JSRule({
    name: "Auf verfrühte Solar Stagnation prüfen",
    triggers: [
      TimerTrigger("0 0/10 * * * ?", '')
    ],
    execute: executeSolarStagRule
  });

  JSRule({
    name: "Solar Stagnationsalarm löschen",
    triggers: [
      TimerTrigger("0 0 0 1/1 * ? *", '')
    ],
    execute: executeSolarStagReset
  });

  executeSolarStagRule();
  executeSolarStagReset();

} catch (e) {
  console.log("ERROR!");
  console.log(e);
}