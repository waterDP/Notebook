function vue() {
  return {
    name: "vue",
    async transform(code, id) {
      if (id.endsWith(".vue")) {
        return `
          const _sfc_main = {
            name: 'App'
          }
          import {openBlock as _openBlock, createElement as _createElementBlock} from '/node_modules/.vite/deps/vue.js?v=0ccbdf1'
          function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
            return {_openBlock(), _createElementBlock("h1", null, "App")}
          }
          _sfc_main.render = _sfc_render;
          export default sfc_main;
        `;
      }
      return null;
    },
  };
}

module.exports = vue;
