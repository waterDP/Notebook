const defaultRE = /\{\{((?:.|\r?\n)+?)\}\}/g
export const util = {
    getValue(vm,expr){ // [msg]
        let keys = expr.split('.');
        return keys.reduce((memo,current)=>{ // reduce 他具备迭代的功能
            memo = memo[current]; //  vm.school.name
            return memo
        },vm);
    },
    compilerText(node,vm){ // 编译文本 替换{{school.name}}
        node.textContent = node.textContent.replace(defaultRE,function (...args) {
            return util.getValue(vm,args[1]); 
        })
    }
}
export function compiler(node,vm){ // node 就是文档碎片 
    let childNodes = node.childNodes; // 只有第一层 只有儿子 没有孙子
    // 将类数组转化成数组
    [...childNodes].forEach(child=>{ // 一种是元素 一种是文本 
        if(child.nodeType == 1){ //1 元素  3表示文本
            compiler(child,vm); // 编译当前元素的孩子节点
        }else if(child.nodeType == 3){
            util.compilerText(child,vm);
        }
    });
}