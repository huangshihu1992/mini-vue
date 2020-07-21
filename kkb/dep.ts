// 和data中的每一个key对应起来, 负责管理相关的watcher
class Dep {
    deps: any[];
    static target: any;
    constructor() {
        this.deps = [];
    }

    addDep(dep) {
        this.deps.push(dep);
    }

    notify() {
        this.deps.forEach(dep => dep.update());
    }
}

export default Dep;