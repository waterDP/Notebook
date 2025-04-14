/*
 * @Author: water.li
 * @Date: 2025-04-13 17:14:51
 * @Description:
 * @FilePath: \Notebook\前端工程化\Rollup\import.meta.inteface.ts
 */
interface ImportMeta {
	readonly hot?: {
		readonly data: any
		accept(cb?: (mod: any) => void): void
		accept(dep: string, cb?: (mod: any) => void): void
		accept(deps: readonly string[], cb?: (mods: any[]) => void): void

		dispose(cb?: (data: any) => void): void
		decline(): void
		invalidate(): void

		on(event: string, cb: (payload: any) => void): void
	}
}
