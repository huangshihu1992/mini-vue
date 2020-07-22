class Watcher {
    _vm;
    _key;
    constructor(vm, key) {
        this._vm = vm;
        this._key = key;
    }
    update() {
        console.log(this._key + "通知更新");
    }
}

export default Watcher;
