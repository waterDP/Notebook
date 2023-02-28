import * as ReactWorkTags from "react-reconciler/src/ReactWorkTags";
const ReactWorkTagsMap = new Map();
for (let tag in ReactWorkTags) {
  ReactWorkTagsMap.set(ReactWorkTags[tag], tag);
}

export default function (prefix, workInProgress) {
  let tagValue = workInProgress.tag;
  let tagName = ReactWorkTagsMap.get(tagValue);
  let str = `${tagName}`;
  if (tagName === "HostComponent") {
    str += `${workInProgress.tag}`;
  } else if (tagName === "HostTest") {
    str += `${workInProgress.pendingProps}`;
  }
  console.log(`${prefix} ${str}`);
}
