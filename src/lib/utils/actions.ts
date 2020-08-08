class Actions {

  actions: {[key: string]: any} = {}

  constructor() {
    this.initActions();
  }

  public initActions() {

    const ScriptServiceUtil = Java.type("org.eclipse.smarthome.model.script.ScriptServiceUtil");

    const services = ScriptServiceUtil.getActionServices();
    if (services != null) {
      for (var actionService in services) {

        const cn = services[actionService].getActionClassName();
        const className = cn.substring(cn.lastIndexOf(".") + 1);

        this.actions[className] = services[actionService];
      }
    }
  }

  public getAction(name: string): any {
    return this.actions[name].getActionClass();
  }

  public sendMail(mail: string, subject: string, message: string) {
    this.getAction("Mail").static.sendMail(mail, subject, message);
  };
}

export default new Actions();