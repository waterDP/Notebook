

import { defineConfig } from 'vite'
import viteBaseConfig from './vite.base.config'
import viteDevConfig from './vite.dev.config'
import viteProdConfig from './vite.prod.config'

const envResolver = {
  "build": () => Object.assign({}, viteBaseConfig, viteProdConfig),
  "serve": () => Object.assign({}, viteBaseConfig, viteDevConfig)
}

export default defineConfig(({ command }) => {
  return envResolver[command]()
})