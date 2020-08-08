se.importPreset("RuleSupport");
se.importPreset("RuleSimple");

type Product = { 
	execute: any, 
	triggers: Trigger[], 
	description?: string, 
	name?: string, 
	getEventTrigger?:any
};

export const JSRule = (obj: Product): Rule => {

	var SimpleRuleExtender = Java.extend(SimpleRule);
	var rule:SimpleRule = new SimpleRuleExtender({
		execute: obj.execute
	});

	var triggers:Trigger[] = obj.triggers ? obj.triggers : obj.getEventTrigger();

	if (obj.description) {
		rule.setDescription(obj.description);
	}
	if (obj.name) {
		rule.setName(obj.name);
	}

	//1. Register rule here
	if (triggers && triggers.length > 0) {
		rule.setTriggers(triggers);
		return automationManager.addRule(rule);
	}

	//2. OR second option, to add Rules in rulefile. Is not needed.
	return rule;
}