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
                this.compileElement(node);
            } else if (this.isInter(node)) {
                // 插值文本
                // new Watcher(this._vm, RegExp.$1, this.update(node));
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
    htmlUpdate(node, value) {
        node.innerHTML = value;
    }
    modelUpdate(node, value) {
        node.value = value;
    }

    compileElement(node) {
        // console.log(node, "node");
        const nodeAttrs = node.attributes;

        Array.from(nodeAttrs).forEach(attr => {
            console.log(attr, "attr");
            const attrName = attr.name; // v-xxx
            const exp = attr.value; // v-xxx的值
            
            if (this.isDirective(attrName)) {
                const substr = attrName.substring(2);
                if (this.isOnEvent(attrName)) {

                } else {
                    this[substr] && this[substr](node, exp);
                }
            } else if (this.isEvent(attrName)) {
                const event = attrName.substring(1);
                this[event] && this[event](node, exp);
            }
        })
    }

    isDirective(attr) {
        console.log(attr.indexOf("v-"))
        return attr.indexOf("v-") === 0;
    }

    isOnEvent(attr) {
        return attr.indexOf("on:") === 0;
    }
    isEvent(attr) {
        console.log(attr, "nae");
        return attr.indexOf("@") === 0 && attr[0] === "@"
    }
    isInput(node) {
        return node.nodeName === "INPUT"
    }
    hasMethod(method) {
        return !!method;
    }

    text(node, exp) {
        this.update(node, exp, "text");
    }
    
    html(node, exp) {
        this.update(node, exp, "html");
    }

    model(node, exp) {
        this.isInput(node) && this.update(node, exp, "model");

        node.addEventListener("input", e => {
            this._vm[exp] = e.target.value;
        })
    }
    
    click(node, exp) {
        const clickFn = this._vm._options.methods[exp];
        if(this.hasMethod(clickFn)) {
            let that = this;
            node.onclick = function() {
                clickFn && clickFn.call(that._vm);
            };
        }
    }
}
