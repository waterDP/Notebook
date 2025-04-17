import type { LinkSourceInfo, ScriptSourceInfo, SourceAddress } from '@micro-app/types'
import { isInlineScript } from '../libs/utils'

export interface SourceCenter<L = LinkSourceInfo, S = ScriptSourceInfo> {
  link: {
    setInfo (address: SourceAddress, info: L): void,
    getInfo (address: SourceAddress): L | null,
    hasInfo (address: SourceAddress): boolean,
    deleteInfo (address: SourceAddress): boolean,
  },
  script: {
    setInfo (address: SourceAddress, info: S): void,
    getInfo (address: SourceAddress): S | null,
    hasInfo (address: SourceAddress): boolean,
    deleteInfo (address: SourceAddress): boolean,
    deleteInlineInfo (addressList: Set<SourceAddress>): void,
  }
}

export type LinkListType = Map<SourceAddress, LinkSourceInfo>
export type ScriptListType = Map<SourceAddress, ScriptSourceInfo>

/**
 * SourceCenter is a resource management center
 * All html, js, css will be recorded and processed here
 * NOTE:
 * 1. All resources are global and shared between apps
 * 2. Pay attention to the case of html with parameters
 * 3. The resource is first processed by the plugin
 */
function createSourceCenter (): SourceCenter {
  const linkList: LinkListType = new Map()
  const scriptList: ScriptListType = new Map()

  function createSourceHandler <P, T extends Map<SourceAddress, P>> (targetList: T): SourceCenter<P>['link'] | SourceCenter<LinkSourceInfo, P>['script'] {
    return {
      setInfo (address: SourceAddress, info: P): void {
        targetList.set(address, info)
      },
      getInfo (address: SourceAddress): P | null {
        return targetList.get(address) ?? null
      },
      hasInfo (address: SourceAddress): boolean {
        return targetList.has(address)
      },
      deleteInfo (address: SourceAddress): boolean {
        return targetList.delete(address)
      }
    }
  }

  return {
    link: createSourceHandler<LinkSourceInfo, LinkListType>(linkList),
    script: {
      ...createSourceHandler<ScriptSourceInfo, ScriptListType>(scriptList),
      deleteInlineInfo (addressList: Set<SourceAddress>): void {
        addressList.forEach((address) => {
          if (isInlineScript(address)) {
            scriptList.delete(address)
          }
        })
      }
    },
  }
}

export default createSourceCenter()
