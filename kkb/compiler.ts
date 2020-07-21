// Compiler: 遍历模板, 分析其中哪些地方用到了data中的key以及事件等指令
// 这时认为是一个依赖, 创建一个Watcher实例, 使界面中的DOM更新函数和key
// 挂钩, 如果更新key, 则执行这个更新函数

import Watcher from "./watcher";

class Compiler {
    $el: any;
    $vm: any;
    // el: 宿主元素
    // vm: Vue实例
    constructor(el, vm) {
        this.$vm = vm;
        this.$el = document.querySelector(el);

        // 执行编译
        this.compile(this.$el);
    }

    compile(el) {
        const childNodes: HTMLElement[] = el.childNodes;
        Array.from(childNodes).forEach(node => {
            if (this.isElement(node)) {
                // 元素
                // console.log("编译元素:" + node.nodeName);
                this.compileElement(node);
            } else if (this.isInter(node)) {
                // 插值文本 {{xx}}
            }

            // 递归可能存在的子元素
            this.compile(node);
        })
    }

    isElement(node) {
        return node.nodeType === 1;
    }
    // 是否插值表达式: 是文本节点并且符合正则
    isInter(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }

    // 编译插值文本
    compileText(node) {
        // node.textContent = this.$vm[RegExp.$1];
        this.update(node, RegExp.$1, "text");
    }

    // update函数: 负责更新dom, 同时创建Watcher实例在两者之间挂钩
    update(node, exp, dir) {
        // 首次初始化
        const updateFn = this[dir + "Updater"];
        updateFn && updateFn(node, this.$vm[exp]);
        // 更新
        new Watcher(this.$vm, exp, function(value) {
            updateFn && updateFn(node, value);
        })
    }

    textUpdater(node, value) {
        node.textContent = value;
    }

    compileElement(node) {
        
    }
}

export default Compiler;