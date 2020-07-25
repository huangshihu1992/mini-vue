class Vue {
    _options;
    _data;
    constructor(options) {
        this._options = options;

        this._data = options.data;

        this.observe(this._data);

        // 编译
        new Compiler(this._options.el, this);

        // created
        this._options.created.call(this);

        this.setMethod(this._options.methods);

    }

    observe(obj) {
        if (!obj || typeof obj !== "object") return;

        Object.keys(obj).forEach(key => {
            this.defineReactive(obj, key, obj[key]);

            this.proxyData(key);
        });
    }

    defineReactive(obj, key, val) {
        this.observe(val);

        // 一个key对应一个dep
        const dep = new Dep();

        Object.defineProperty(obj, key, {
            get() {
                // 依赖收集
                Dep.target && dep.addDep(Dep.target);
                return val;
            },
            set(newVal) {
                if (newVal === val) return;
                val = newVal;
                // 通知更新
                dep.notify();
            }
        })
    }

    proxyData(key) {

        Object.defineProperty(this, key, {
            get() {
                return this._data[key];
            },
            set(newVal) {
                this._data[key] = newVal;
            }
        })
    }

    setMethod(methods) {
        Object.keys(methods).forEach(key => {
            this[key] = methods[key];
        })
    }
}

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

class Watcher {
    _vm;
    _key;
    cb;
    constructor(vm, key, cb) {
        this._vm = vm;
        this._key = key;
        this.cb = cb;

        Dep.target = this;
        // 触发依赖收集
        this._vm[this._key];
        Dep.target = null;
        
    }
    update() {
        this.cb.call(this._vm, this._vm[this._key]);
    }
}
