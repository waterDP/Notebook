/**
 * * 三种角色
 * ^ Receiver 接受者角色 该角色就是干活的对象，命令传递到这里是应该被执行的
 * ^ Command 命令角色 需要执行的所有命令都在这里面
 * ^ Invoker 调用者角色 接受到命令，并执行命令
 */

class Cooker {
  cook() {
    console.log("做饭");
  }
}

class Cleaner {
  clean() {
    console.log("保洁");
  }
}

class CookCommand {
  constructor(private receiver) {}
  execute() {
    this.receiver.cook();
  }
}

class CleanCommand {
  constructor(private receiver) {}
  execute() {
    this.receiver.clean();
  }
}

class Customer {
  constructor(private command) {}
  setCommand(command) {
    this.command = command;
  }
  clean() {
    this.command.execute();
  }
  cook() {
    this.command.execute();
  }
}

let cooker = new Cooker();
let cleaner = new Cleaner();
let cookCommand = new CookCommand(cooker);
let cleanCommand = new CleanCommand(cleaner);
let customer = new Customer(cookCommand);
customer.cook();
customer.setCommand(cleaner);
customer.clean();


