import { console } from "./lib/bootstrap";
import { setTimeout } from "./lib/utils/timer";
import { JSRule } from "./lib/rules/rules";
import { TimerTrigger } from "./lib/rules/triggers";

// import java.util.Timer from Java
// se.importPreset("Timer");

console.log("TEST: Starting ....");

const tt1 = setTimeout(() => {
  console.log("You should read this 501ms later ...");
}, 501);

const tt2 = setTimeout(() => {
  console.log("You shouldn't see this, it is canceled!");
}, 500);

tt2.cancel();


var rule = JSRule({
  name: "My TypeScript Rule",
  triggers: [
    TimerTrigger("0 0/5 * * * ?", "triggerName")
  ],
  // uid: '1111',
  execute: function (module: Module, input: TriggerValues) {
    console.log("A message from a rule in line " + __LINE__);
  }
});

try {
  ruleRegistry.remove(rule.getUID());
  // automationManager.removeHandler(rule.);
} catch (e) {
  console.log("UPS!");
  console.log(e);
}



console.log("TEST: End ....");