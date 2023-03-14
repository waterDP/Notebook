import assign from "shared/assign";

function functionThatReturnTrue() {
  return true;
}

function functionThatReturnFalse() {
  return false;
}

const MouseEventInterface = {
  clientX: 0,
  clientY: 0,
};

function createdSyntheticEvent(inter) {
  /**
   * 合成事件的基类
   * @param {*} reactName React属性名 onClick
   * @param {*} reactEventName click
   * @param {*} targetInst 事件源fiber实例
   * @param {*} nativeEvent 原生事件对象
   * @param {*} nativeTarget 原生事件源 span 事件源对应的那个真实DOM
   */
  function SyntheticeBaseEvent(
    reactName,
    reactEventName,
    targetInst,
    nativeEvent,
    nativeTarget
  ) {
    this._reactName = reactName;
    this.type = reactEventName;
    this._targetInst = targetInst;
    this.nativeEvent = nativeEvent;
    this.target = nativeTarget;
    // 把此接口上对应的属性从原生事件上拷贝到合成事件上
    for (const propName in inter) {
      if (!inter.hasOwnProperty(propName)) {
        continue;
      }
      this[propName] = nativeEvent[propName];
    }
    // 是否已经阻止默认事件
    this.isDefaultPrevented = functionThatReturnFalse;
    // 是否已经阻止继续传播了
    this.isPropagationStopped = functionThatReturnFalse;
    return this;
  }
  assign(SyntheticeBaseEvent.prototype, {
    preventDefault() {
      const event = this.nativeEvent;
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
      this.isDefaultPrevented = functionThatReturnFalse;
    },
    stopPropagation() {
      const event = this.nativeEvent;
      if (event.stopPropagtion) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      this.isPropagationStopped = functionThatReturnTrue;
    },
  });
  return SyntheticeBaseEvent;
}

export const SyntheticMouseEvent = createdSyntheticEvent(MouseEventInterface);
