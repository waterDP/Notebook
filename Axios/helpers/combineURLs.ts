/*
 * @Author: water.li
 * @Date: 2023-01-19 10:44:54
 * @Description:
 * @FilePath: \Notebook\Axios\helpers\combineURLs.ts
 */

export default function combineURLs(
  baseURL: string,
  relativeURL: string
): string {
  return relativeURL
    ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
    : baseURL;
}
