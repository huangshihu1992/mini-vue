// dep和data里的key是一对一的对应关系; dep和watcher是一对多的对应关系;
class Dep {
    deps;
    static target;
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
