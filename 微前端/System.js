/*
 * @Author: water.li
 * @Date: 2023-05-26 22:26:57
 * @Description:
 * @FilePath: \Notebook\微前端\System.js
 */
const newMapUrl = {};

// 解析importsMap
function processScripts() {
  Array.from(document.querySelectorAll("script")).forEach((script) => {
    if (script.type === "systemjs-importmap") {
      const imports = JSON.parse(script.innerHTML).imports;
      Object.entries(imports).forEach(([key, value]) => {
        newMapUrl[key] = value;
      });
    }
  });
}

// 加载资源
function load(id) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = id;
    script.async = true;
    document.head.appendChild(script);
    script.addEventListener("load", () => {
      resolve();
    });
  });
}

export class SystemJs {
  import(id) {
    return Promise.resolve(processScripts())
      .then(() => {
        const lastSepIndex = location.href.lastIndexOf("/");
        const baseUrl = location.href.slice(0, lastSepIndex);
        if (id.startsWith("./")) {
          return baseUrl + id.slice(2);
        }
      })
      .then((id) => {
        // 根据文件的路径 来加载资源
        return load(id).then(() => {});
      });
  }
  register(deps, declare) {
    
  }
}
