se.importPreset("RuleSupport");

export const ChangedEventTrigger = (itemName: string, oldState?: State, newState?: State, triggername?: string) =>
    buildTrigger(getTrName(triggername, itemName), "core.ItemStateChangeTrigger", new Configuration({
        "itemName": itemName,
        "state": newState,
        "oldState": oldState
    }));


// ### UpdatedEventTrigger ###
export const UpdatedEventTrigger = (itemName: string, state?:string, triggerName?:string) =>
    buildTrigger(getTrName(triggerName, itemName), "core.ItemStateUpdateTrigger", new Configuration({
        "itemName": itemName,
        "state": state
    }));


// ### stateCondition ###
export const StateCondition = (itemName: string, state: string, condName: string) => {
    return ConditionBuilder.create()
        .withId(condName)
        .withTypeUID("core.ItemStateCondition")
        .withConfiguration(new Configuration({
            "itemName": itemName,
            "operator": "=",
            "state": state
        }))
        .build();
}

export const CommandEventTrigger = (itemName: string, command:Command, triggerName:string) =>
    buildTrigger(getTrName(triggerName, itemName), "core.ItemCommandTrigger", new Configuration({
        "itemName": itemName,
        "command": command
    }));

export const TimerTrigger = (expression:string, triggerName:string) =>
    buildTrigger(getTrName(triggerName), "timer.GenericCronTrigger", new Configuration({
        "cronExpression": expression
    }));

const buildTrigger = (triggerName: string, type: string, configuration: Configuration): Trigger =>
    TriggerBuilder.create()
        .withTypeUID(type)
        .withId(triggerName)
        .withConfiguration(configuration)
        .build();

const getTrName = (triggerName: any, itemName?: any): string =>
    triggerName != undefined && triggerName != null && triggerName != "" ? triggerName :
    itemName != undefined && itemName != null && itemName != "" ? itemName :
    "xxxxxx";
