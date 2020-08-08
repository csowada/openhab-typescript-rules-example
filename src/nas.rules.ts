import { JSRule } from "./lib/rules/rules";
import { ChangedEventTrigger } from "./lib/rules/triggers";
import { stateAsNumber, postUpdate } from "./lib/utils/helpers"

// #################################################################
// ##                         LOGIC                               ##
// #################################################################

const compute = (volNumber: number) => {
  return () => {
    stateAsNumber("NAS_Vol" + volNumber + "_Size", (size) => {
      stateAsNumber("NAS_Vol" + volNumber + "_Used", (used) => {
        stateAsNumber("NAS_Vol" + volNumber + "_Unit", (blockSize) => {

          postUpdate("NAS_Vol" + volNumber + "_Used_GB", (used * blockSize) / 1073741824)
          postUpdate("NAS_Vol" + volNumber + "_Available_GB", ((size - used) * blockSize) / 1073741824)
          postUpdate("NAS_Vol" + volNumber + "_Used_Percent", used / size * 100)
        })
      })
    })
  }
}

// #################################################################
// ##                         RULES                               ##
// #################################################################


var vols = [1, 2];

vols.forEach((volNumber) => {

  const computeVolumeSize = compute(volNumber);

  JSRule({
    name: "NAS VOL" + volNumber + " Update",
    description: "Compute Drive capacity",
    triggers: [
      ChangedEventTrigger("NAS_Vol" + volNumber + "_Used")
    ],
    execute: computeVolumeSize
  });

  // direkt beim laden das erste mal ausführen
  computeVolumeSize();
});