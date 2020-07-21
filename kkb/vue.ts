import Dep from "./dep";
import Watcher from "./watcher";
import Compiler from "./compiler";

class Vue {
    $data: any;
    $options: any;
    constructor(options) {
        this.$options = options;

        this.$data = options.data;

        // 响应化
        this.observe(this.$data);

        // 依赖收集
        // new Watcher(this, "test");
        // this.test;
        new Compiler(options.el, this);
    }

    observe(value) {
        if (!value || typeof value !== "object") return;
        
        Object.keys(value).forEach(key => {
            this.defineReactive(value, key, value[key]);

            // 代理data的属性到Vue上
            this.proxyData(key);
        })
    }

    defineReactive(obj, key, val) {
        // val可能存在是个对象的情况, 需要递归
        this.observe(val);

        const dep = new Dep();

        Object.defineProperty(obj, key, {
            get() {
                // 为什么要在读取的时候进行依赖收集
                Dep.target && dep.addDep(Dep.target);
                return val;
            },
            set(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                // 通知更新
                dep.notify();
            }
        })
    }

    proxyData(key) {
        Object.defineProperty(this, key, {
            get() {
                return this.$data;
            },
            set(newVal) {
                this.$data[key] = newVal;
            }
        })
    }
}