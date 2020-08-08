se.importPreset("Timer");

export const setTimeout = (fn: ()=>void, millis: number): java.util.TimerTask => {

    const TimerTask = Java.type("java.util.TimerTask");
    const TimerTaskExtender = Java.extend(TimerTask);
    
    const task = new TimerTaskExtender({
        run: fn
    });

    timer.schedule(task, millis);
    return task;
}

export const clearTimeout = (task: java.util.TimerTask) => {
    task.cancel();
}

export const setInterval = (fn: () => void, millis: number): java.util.TimerTask => {
    const TimerTask = Java.type("java.util.TimerTask");
    const TimerTaskExtender = Java.extend(TimerTask);
    
    const task = new TimerTaskExtender({
        run: fn
    });

    timer.scheduleAtFixedRate(task, millis, millis)
    return task;
}

export const clearInterval = (task: java.util.TimerTask) => {
    task.cancel();
}