class Compiler {
    _el;
    _vm;
    constructor(el, vm) {
        this._el = document.querySelector(el);
        this._vm = vm;

        if (this._el) {
            this.compile(this._el);

            // this._el.appendChild(this._el);
        }
    }

    compile(node) {
        const childNodes = node.childNodes;
        Array.from(childNodes).forEach(node => {
            // nodeType有多少种 常见2种 1 元素 | 3 文本
            if (this.isElement(node)) {
                // 元素
                console.log(node + "元素");
            } else if (this.isInter(node)) {
                // 插值文本
                // new Watcher(this._vm, RegExp.$1, this.update(node));
                console.log(node + "插值文本");
                this.compileText(node, RegExp.$1);
            }
            // @ts-ignore
            this.compile(node);
        })
    }
    isElement(node) {
        return node.nodeType === 1;
    }
    isInter(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }
    compileText(node, key) {
        // node.textContent = this._vm[key];
        this.update(node, key, "text");
    }
    // update(node) {
    //     let that = this;
    //     return function(key) {
    //         that.compileText(node, key);
    //         console.log(key + "属性更新");
    //     }
    // }
    update(node, exp, dir) {
        const updateFn = this[dir + "Update"];
        updateFn && updateFn(node, this._vm[exp]);

        new Watcher(this._vm, exp, function(value) {
            updateFn && updateFn(node, value);
        });
    }

    textUpdate(node, value) {
        node.textContent = value;
    }
}
