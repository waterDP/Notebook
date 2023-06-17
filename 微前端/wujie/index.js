function createIframe() {
  const iframe = document.createElement("iframe");
  iframe.src = "about:blank";
  document.body.appendChild(iframe);

  return iframe;
}

function createSandbox() {
  const sandbox = {
    iframe: createIframe(), // 创建了一个iframe沙箱
    shadowRoot: null,
  };

  return sandbox;
}

function injectTemplate(sandbox, template) {
  
}

export function createCustomElement() {
  class WujieApp extends HTMLElement {
    connectedCallback() {
      // 表示标签渲染完毕
      // 1 创建沙箱
      const sandbox = createSandbox();
      // 2 创建shadowDom
      sandbox.shadowRoot = this.attachShadow({ mode: "open" });
      // 3 将html css 放入shadowDom中
      injectTemplate(sandbox, strTmpWidthCSS);
      // 4 将js 放入沙箱中执行
    }
  }
  window.customElements.define("wujie-app", WujieApp);
  container.appChild(window.createElement("wujie-app"));
}
