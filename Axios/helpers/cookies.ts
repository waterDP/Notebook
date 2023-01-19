/*
 * @Author: water.li
 * @Date: 2023-01-19 14:57:14
 * @Description: cookies
 * @FilePath: \Notebook\Axios\helpers\cookies.ts
 */
const cookies = {
  read(name: string): string | null {
    const match = document.cookie.match(
      new RegExp("(^|;\\s*)(" + name + ")=([^;]*)")
    );
    return match ? decodeURIComponent(match[3]) : null;
  },
};

export default cookies;
