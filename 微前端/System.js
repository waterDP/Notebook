/*
 * @Author: water.li
 * @Date: 2023-05-26 22:26:57
 * @Description:
 * @FilePath: \Notebook\微前端\System.js
 */
const newMapUrl = {};
let lastRegister;

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
    script.src = newMapUrl[id] || id;
    script.async = true;
    document.head.appendChild(script);
    script.addEventListener("load", () => {
      let _lastRegister = lastRegister;
      lastRegister = null;
      resolve(_lastRegister);
    });
  });
}

let set = new Set();
function saveGlobalProperty() {
  for (let k in window) {
    set.add(k);
  }
}
saveGlobalProperty();
function getLastGlobalProperty() {
  for (let k in window) {
    if (set.has(k)) {
      if (set.has(k)) continue;
      set.add(k);
      return window[k];
    }
  }
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
        let execute;
        return load(id)
          .then((register) => {
            // execute 是真正的渲染逻辑
            // setters 是用来保存加载后的资源 加载资源调用setters
            let { setters, execute: exe } = register[1](() => {});
            execute = exe;
            return [register[0], setters];
          })
          .then(([registeration, setters]) => {
            return Promise.all(
              registeration.map((dep, i) => {
                return load(dep).then(() => {
                  // 加载完毕后，会在window上增添属性 window.React window.ReactDOM
                  const property = getLastGlobalProperty();
                  setters[i](property);
                });
              })
            );
          })
          .then(() => {
            execute();
          });
      });
  }
  register(deps, declare) {
    // 将回调的结果保存起来
    lastRegister = [deps, declare];
  }
}
