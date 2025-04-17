import { isFunction, removeDomScope } from '../libs/utils'
import microApp from '../micro_app'

/**
 * fetch source of html, js, css
 * @param url source path
 * @param appName app name
 * @param config fetch options
 */
export function fetchSource (url: string, appName: string | null = null, options = {}): Promise<string> {
  /**
   * When child navigate to new async page, click event will scope dom to child and then fetch new source
   * this may cause error when fetch rewrite by baseApp
   * e.g.
   * baseApp: <script crossorigin src="https://sgm-static.jd.com/sgm-2.8.0.js" name="SGMH5" sid="6f88a6e4ba4b4ae5acef2ec22c075085" appKey="jdb-adminb2b-pc"></script>
   */
  removeDomScope()
  if (isFunction(microApp.options.fetch)) {
    return microApp.options.fetch(url, options, appName)
  }
  // Don’t use globalEnv.rawWindow.fetch, will cause sgm-2.8.0.js throw error in nest app
  return window.fetch(url, options).then((res: Response) => {
    return res.text()
  })
}
