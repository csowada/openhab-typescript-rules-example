This project is just a Prof of Concept to use Type Script with openHAB. I use Babel 7 to convert TypeScritp to valid Nashorn JavaScript. 

Please check my automation bundle for openHAB

https://github.com/csowada/org.eclipse.smarthome.automation.module.script.jsext
https://github.com/csowada/openhab-typescript-definition

# Install

Download or clone this repository and run  ``npm install`` to install all required modules.

# Example

```typescript
import { JSRule } from "../lib/rules/rules";
import { ChangedEventTrigger } from "../lib/rules/triggers";
import { Helpers } from "../lib/utils/helpers"

export function loadRules() {

    var vols = [1, 2];

    vols.forEach(function(volNumber) {

        JSRule({
            name: "NAS VOL" + volNumber + " Update",
            triggers: [
                ChangedEventTrigger("NAS_Vol" + volNumber + "_Used")
            ],
            execute: function (module: Module, input: TriggerValues) {

                Helpers.getItemNumber("NAS_Vol"+volNumber+"_Size", (size: number) => {
                    Helpers.getItemNumber("NAS_Vol"+volNumber+"_Used", (used: number) => {
                        Helpers.getItemNumber("NAS_Vol"+volNumber+"_Unit", (blockSize: number) => {

                            events.postUpdate(ir.getItem("NAS_Vol"+volNumber+"_Used_GB"), (used * blockSize) / 1073741824)
                            events.postUpdate(ir.getItem("NAS_Vol"+volNumber+"_Available_GB"), ((size - used) * blockSize) / 1073741824)
                            events.postUpdate(ir.getItem("NAS_Vol"+volNumber+"_Used_Percent"), used / size * 100)
                        })
                    })
                })
            }
        });
    });
}
```

# Compile

Run ``npm run build:js`` to create a transpiled JavaScript version. Se ``package.json`` for more details.