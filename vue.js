class Vue {
    _options;
    _data;
    constructor(options) {
        this._options = options;

        this._data = options.data;

        this.observe(this._data);
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

        Object.defineProperty(obj, key, {
            get() {
                return val;
            },
            set(newVal) {
                if (newVal === val) return;
                val = newVal;

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
}