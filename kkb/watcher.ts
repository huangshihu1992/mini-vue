import Dep from "./dep";
// 
class Watcher {
    vm: any;
    cb: any;
    key: any;
    constructor(vm, key, cb) {
        this.vm = vm;
        this.cb = cb;
        this.key = key;
        Dep.target = this;
        this.vm[this.key];
        Dep.target = null;
    }

    update() {
        console.log(this.key, "属性更新");
        this.cb.call(this.vm, this.vm[this.key]);
    }
}

export default Watcher;