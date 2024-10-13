/*
 * @Author: water.li
 * @Date: 2024-10-13 22:46:55
 * @Description: e
 * @FilePath: \Notebook\Vue\vue记录\showMessage.jsx
 */

import { createApp } from "vue";

const MessageBox = {
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  render(context) {
    const { $props, $emit } = context;
    return (
      <div class="modal">
        <div class="text">{$props.msg}</div>
        <Button click={$emit("click")}></Button>
      </div>
    );
  },
};

function showMsg(msg, clickHandler) {
  const div = document.createElement("div");
  document.body.appendChild(div);
  const app = createApp(MessageBox, {
    msg,
    onClick() {
      clickHandler &&
        clickHandler(() => {
          app.unmount(div);
          div.remove();
        });
    },
  });
  app.mount(div);
}

export default showMsg;
