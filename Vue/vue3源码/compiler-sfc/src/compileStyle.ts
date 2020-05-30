import postcss, { ProcessOptions, LazyResult, Result, ResultMap } from 'postcss'
import trimPlugin from './stylePluginTrim'
import scopedPlugin from './stylePluginScoped'
import {
  processors,
  StylePreprocessor,
  StylePreprocessorResults,
  PreprocessLang
} from './stylePreprocessors'
import { RawSourceMap } from 'source-map'

export interface SFCStyleCompileOptions {
  source: string
  filename: string
  id: string
  map?: RawSourceMap
  scoped?: boolean
  trim?: boolean
  preprocessLang?: PreprocessLang
  preprocessOptions?: any
  preprocessCustomRequire?: (id: string) => any
  postcssOptions?: any
  postcssPlugins?: any[]
}

export interface SFCAsyncStyleCompileOptions extends SFCStyleCompileOptions {
  isAsync?: boolean
  // css modules support, note this requires async so that we can get the
  // resulting json
  modules?: boolean
  // maps to postcss-modules options
  // https://github.com/css-modules/postcss-modules
  modulesOptions?: {
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: string[]
    generateScopedName?:
      | string
      | ((name: string, filename: string, css: string) => string)
    hashPrefix?: string
    localsConvention?: 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly'
  }
}

export interface SFCStyleCompileResults {
  code: string
  map: RawSourceMap | undefined
  rawResult: LazyResult | Result | undefined
  errors: Error[]
  modules?: Record<string, string>
}

export function compileStyle(
  options: SFCStyleCompileOptions
): SFCStyleCompileResults {
  return doCompileStyle({
    ...options,
    isAsync: false
  }) as SFCStyleCompileResults
}

export function compileStyleAsync(
  options: SFCAsyncStyleCompileOptions
): Promise<SFCStyleCompileResults> {
  return doCompileStyle({ ...options, isAsync: true }) as Promise<
    SFCStyleCompileResults
  >
}

export function doCompileStyle(
  options: SFCAsyncStyleCompileOptions
): SFCStyleCompileResults | Promise<SFCStyleCompileResults> {
  const {
    filename,
    id,
    scoped = false,
    trim = true,
    modules = false,
    modulesOptions = {},
    preprocessLang,
    postcssOptions,
    postcssPlugins
  } = options
  const preprocessor = preprocessLang && processors[preprocessLang]
  const preProcessedSource = preprocessor && preprocess(options, preprocessor)
  const map = preProcessedSource ? preProcessedSource.map : options.map
  const source = preProcessedSource ? preProcessedSource.code : options.source

  const plugins = (postcssPlugins || []).slice()
  if (trim) {
    plugins.push(trimPlugin())
  }
  if (scoped) {
    plugins.push(scopedPlugin(id))
  }
  let cssModules: Record<string, string> | undefined
  if (modules) {
    if (__GLOBAL__ || __ESM_BROWSER__) {
      throw new Error(
        '[@vue/compiler-sfc] `modules` option is not supported in the browser build.'
      )
    }
    if (!options.isAsync) {
      throw new Error(
        '[@vue/compiler-sfc] `modules` option can only be used with compileStyleAsync().'
      )
    }
    plugins.push(
      require('postcss-modules')({
        ...modulesOptions,
        getJSON: (_cssFileName: string, json: Record<string, string>) => {
          cssModules = json
        }
      })
    )
  }

  const postCSSOptions: ProcessOptions = {
    ...postcssOptions,
    to: filename,
    from: filename
  }
  if (map) {
    postCSSOptions.map = {
      inline: false,
      annotation: false,
      prev: map
    }
  }

  let result: LazyResult | undefined
  let code: string | undefined
  let outMap: ResultMap | undefined

  const errors: Error[] = []
  if (preProcessedSource && preProcessedSource.errors.length) {
    errors.push(...preProcessedSource.errors)
  }

  try {
    result = postcss(plugins).process(source, postCSSOptions)

    // In async mode, return a promise.
    if (options.isAsync) {
      return result
        .then(result => ({
          code: result.css || '',
          map: result.map && (result.map.toJSON() as any),
          errors,
          modules: cssModules,
          rawResult: result
        }))
        .catch(error => ({
          code: '',
          map: undefined,
          errors: [...errors, error],
          rawResult: undefined
        }))
    }

    // force synchronous transform (we know we only have sync plugins)
    code = result.css
    outMap = result.map
  } catch (e) {
    errors.push(e)
  }

  return {
    code: code || ``,
    map: outMap && (outMap.toJSON() as any),
    errors,
    rawResult: result
  }
}

function preprocess(
  options: SFCStyleCompileOptions,
  preprocessor: StylePreprocessor
): StylePreprocessorResults {
  if ((__ESM_BROWSER__ || __GLOBAL__) && !options.preprocessCustomRequire) {
    throw new Error(
      `[@vue/compiler-sfc] Style preprocessing in the browser build must ` +
        `provide the \`preprocessCustomRequire\` option to return the in-browser ` +
        `version of the preprocessor.`
    )
  }

  return preprocessor.render(
    options.source,
    options.map,
    {
      filename: options.filename,
      ...options.preprocessOptions
    },
    options.preprocessCustomRequire
  )
}
