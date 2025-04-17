import type { AppInterface, fiberTasks } from '@micro-app/types'
import {
  logError,
  CompletionPath,
  injectFiberTask,
  serialExecFiberTasks,
  isBodyElement,
} from '../libs/utils'
import {
  extractLinkFromHtml,
  fetchLinksFromHtml,
} from './links'
import {
  extractScriptElement,
  fetchScriptsFromHtml,
  checkExcludeUrl,
  checkIgnoreUrl,
} from './scripts'
import scopedCSS from '../sandbox/scoped_css'
import globalEnv from '../libs/global_env'

/**
 * Recursively process each child element
 * @param body body element
 * @param app app
 * @param microAppHead micro-app-head element
 */
function flatBodyChildren(
  body: HTMLElement,
  app: AppInterface,
  fiberStyleTasks: fiberTasks,
): void {
  if (!body || !isBodyElement(body)) {
    return
  }
  const links = Array.from(body.getElementsByTagName('link'))

  links.map((dom) => {
    if (dom.hasAttribute('exclude') || checkExcludeUrl(dom.getAttribute('href'), app.name)) {
      dom.parentElement!.replaceChild(document.createComment('link element with exclude attribute ignored by micro-app'), dom)
    } else if (!(dom.hasAttribute('ignore') || checkIgnoreUrl(dom.getAttribute('href'), app.name))) {
      extractLinkFromHtml(dom, dom.parentElement, app)
    } else if (dom.hasAttribute('href')) {
      globalEnv.rawSetAttribute.call(dom, 'href', CompletionPath(dom.getAttribute('href')!, app.url))
    }
    return dom
  })

  const styles = Array.from(body.getElementsByTagName('style'))

  styles.map((dom) => {
    if (dom.hasAttribute('exclude')) {
      dom.parentElement!.replaceChild(document.createComment('style element with exclude attribute ignored by micro-app'), dom)
    } else if (app.scopecss && !dom.hasAttribute('ignore')) {
      injectFiberTask(fiberStyleTasks, () => scopedCSS(dom, app))
    }
    return dom
  })

  const scripts = Array.from(body.getElementsByTagName('script'))

  scripts.map((dom) => {
    extractScriptElement(dom, dom.parentElement, app)
    return dom
  })
  const images = Array.from(body.getElementsByTagName('img'))

  images.map((dom) => {
    if (dom.hasAttribute('src')) {
      globalEnv.rawSetAttribute.call(dom, 'src', CompletionPath(dom.getAttribute('src')!, app.url))
    }
    return dom
  })
}

/**
 * Extract link and script, bind style scope
 * @param htmlStr html string
 * @param app app
 */
export function extractSourceDom(htmlStr: string, app: AppInterface): void {
  const wrapElement = app.parseHtmlString(htmlStr)
  const microAppHead = globalEnv.rawElementQuerySelector.call(wrapElement, 'micro-app-head')
  const microAppBody = globalEnv.rawElementQuerySelector.call(wrapElement, 'micro-app-body')

  if (!microAppHead || !microAppBody) {
    const msg = `element ${microAppHead ? 'body' : 'head'} is missing`
    app.onerror(new Error(msg))
    return logError(msg, app.name)
  }

  const fiberStyleTasks: fiberTasks = app.isPrefetch || app.fiber ? [] : null

  flatBodyChildren(wrapElement, app, fiberStyleTasks)

  /**
   * Style and link are parallel, as it takes a lot of time for link to request resources. During this period, style processing can be performed to improve efficiency.
   */
  const fiberStyleResult = serialExecFiberTasks(fiberStyleTasks)

  if (app.source.links.size) {
    fetchLinksFromHtml(wrapElement, app, microAppHead, fiberStyleResult)
  } else if (fiberStyleResult) {
    fiberStyleResult.then(() => app.onLoad({ html: wrapElement }))
  } else {
    app.onLoad({ html: wrapElement })
  }

  if (app.source.scripts.size) {
    fetchScriptsFromHtml(wrapElement, app)
  } else {
    app.onLoad({ html: wrapElement })
  }
}
