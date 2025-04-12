/*
 * @Author: water.li
 * @Date: 2025-04-06 19:14:31
 * @Description:
 * @FilePath: \Notebook\前端工程化\Vite\vite-env.d.ts
 */
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string
	readonly VITE_APP_BASE_API: string
	readonly VITE_PROXY_TARGET: string
	readonly VITE_TITLE: string
}
