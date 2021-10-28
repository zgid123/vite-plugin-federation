import { PluginHooks } from '../types/pluginHooks'
import {
  findDependencies,
  getModuleMarker,
  parseOptions,
  removeNonLetter
} from './utils'
import {
  builderInfo,
  EXPOSES_CHUNK_SET,
  EXPOSES_MAP,
  parsedOptions
} from './public'
import {
  ConfigTypeSet,
  SharedRuntimeInfo,
  VitePluginFederationOptions
} from 'types'
import { OutputAsset, OutputChunk, RenderedChunk } from 'rollup'
import MagicString from 'magic-string'
import { walk } from 'estree-walker'
import * as path from 'path'

export let provideShared: (string | (ConfigTypeSet & SharedRuntimeInfo))[]

export function sharedPlugin(
  options: VitePluginFederationOptions
): PluginHooks {
  parsedOptions.shared = provideShared = parseOptions(
    options.shared || {},
    () => ({
      import: true,
      shareScope: 'default'
    }),
    (value) => {
      value.import = value.import ?? true
      value.shareScope = value.shareScope || 'default'
      return value
    }
  ) as (string | (ConfigTypeSet & SharedRuntimeInfo))[]
  const sharedNames = new Set<string>()
  provideShared.forEach((value) => sharedNames.add(value[0]))
  const exposesModuleIdSet = new Set()
  EXPOSES_MAP.forEach((value) => {
    exposesModuleIdSet.add(`${value}.js`)
  })
  let isHost
  let isRemote

  return {
    name: 'originjs:shared',
    virtualFile: {
      __rf_fn__import: `
      const moduleMap= ${getModuleMarker('moduleMap', 'var')}
      const sharedInfo = ${getModuleMarker('sharedInfo', 'var')}
      const moduleCache = Object.create(null);
      async function importShared(name,shareScope = 'default') {
        return moduleCache[name] ? new Promise((r) => r(moduleCache[name])) : getProviderSharedModule(name, shareScope);
      }
      async function getProviderSharedModule(name,shareScope) {
        let module = null;
        if (globalThis?.__rf_var__shared?.[shareScope]?.[name]) {
          const dep = globalThis.__rf_var__shared[shareScope][name];
          if (sharedInfo[name]?.requiredVersion) {
            // judge version satisfy
            const satisfies = await import('semver/functions/satisfies');
            const fn = satisfies.default||satisfies
            if (fn(dep.version, sharedInfo[name].requiredVersion)) {
               module = await dep.get();
            } else {
              console.log(\`provider support \${name}(\${dep.version}) is not satisfied requiredVersion(\${sharedInfo[name].requiredVersion})\`)
            }
          } else {
            module = await dep.get(); 
          }
        }
        if(module){
          if(moduleMap[name]?.asMap){
            moduleCache[name] = wrapProxy(name, module);
          }else {
            moduleCache[name] = module;
          }
          return moduleCache[name];
        }else{
          return getConsumerSharedModule(name, shareScope);
        }
      }
      async function getConsumerSharedModule(name , shareScope) {
        if (sharedInfo[name]?.import) {
          const module = await moduleMap[name].get()
          if(moduleMap[name]?.asMap){
            moduleCache[name] = wrapProxy(name,module)
          }else{
            moduleCache[name] = module;
          }
          return moduleCache[name]
        } else {
          console.error(\`consumer config import=false,so cant use callback shared module\`)
        }
      }
      function wrapProxy(name,  module) {
        return new Proxy(module, {
          get(target, prop, receiver) {
            console.log(prop)
            if (Reflect.has(target, prop)) {
              return target[prop];
            } else {
              const asMap = moduleMap[name]?.asMap;
              if (asMap?.[prop]) {
                return target[asMap[prop]];
              }
            }
          }
        })
      }
      export {importShared};
      `
    },
    options(inputOptions) {
      isHost = !!parsedOptions.remotes.length
      isRemote = !!parsedOptions.exposes.length
      if (sharedNames.size) {
        // remove item which is both in external and shared
        inputOptions.external = (inputOptions.external as [])?.filter(
          (item) => {
            return !sharedNames.has(item)
          }
        )
        // add shared content into input
        sharedNames.forEach((shareName) => {
          inputOptions.input![`${getModuleMarker(shareName, 'input')}`] =
            shareName
        })
      }
      return inputOptions
    },

    async buildStart() {
      for (const arr of provideShared) {
        const id = await this.resolveId(arr[0])
        arr[1].id = id
        if (isHost && !arr[1].version) {
          const regExp = new RegExp(`node_modules[/\\\\]${arr[0]}[/\\\\]`)
          const packageJsonPath = `${id?.split(regExp)[0]}node_modules/${
            arr[0]
          }/package.json`
          try {
            arr[1].version = (await import(packageJsonPath)).version
            arr[1].version.length
          } catch (e) {
            this.error(
              `No description file or no version in description file (usually package.json) of ${arr[0]}(${packageJsonPath}). Add version to description file, or manually specify version in shared config.`
            )
          }
        }
      }
      if (provideShared.length && isRemote) {
        this.emitFile({
          fileName: `${
            builderInfo.assetsDir ? builderInfo.assetsDir + '/' : ''
          }__rf_fn__import.js`,
          type: 'chunk',
          id: '__rf_fn__import',
          preserveSignature: 'strict'
        })
      }
    },

    outputOptions: function (outputOption) {
      const that = this
      const priority: string[] = []
      const depInShared = new Map()
      provideShared.forEach((value) => {
        const shareName = value[0]
        // pick every shared moduleId
        const usedSharedModuleIds = new Set<string>()
        const sharedModuleIds = new Map<string, string>()
        // exclude itself
        provideShared
          .filter((item) => item[0] !== shareName)
          .forEach((item) => sharedModuleIds.set(item[1].id, item[0]))
        depInShared.set(shareName, usedSharedModuleIds)
        const deps = new Set<string>()
        findDependencies.apply(that, [
          value[1].id,
          deps,
          sharedModuleIds,
          usedSharedModuleIds
        ])
        value[1].dependencies = deps
      })
      // judge dependencies priority
      const orderByDepCount: Map<string, Set<string>>[] = []
      depInShared.forEach((value, key) => {
        if (!orderByDepCount[value.size]) {
          orderByDepCount[value.size] = new Map()
        }
        orderByDepCount[value.size].set(key, value)
      })

      // dependency nothing is first
      for (let i = 0; i < orderByDepCount.length; i++) {
        if (i === 0) {
          for (const key of orderByDepCount[i].keys()) {
            priority.push(key)
          }
        } else {
          for (const entries of orderByDepCount[i].entries()) {
            addDep(entries, priority, depInShared)
          }
        }
      }

      function addDep([key, value], priority, depInShared) {
        for (const dep of value) {
          if (!priority.includes(dep)) {
            addDep([dep, depInShared.get(dep)], priority, depInShared)
          }
        }
        if (!priority.includes(key)) {
          priority.push(key)
        }
      }

      // adjust the map order according to priority
      provideShared.sort((a, b) => {
        const aIndex = priority.findIndex((value) => value === a[0])
        const bIndex = priority.findIndex((value) => value === b[0])
        return aIndex - bIndex
      })

      // only active when manualChunks is function,array not to solve
      if (typeof outputOption.manualChunks === 'function') {
        outputOption.manualChunks = new Proxy(outputOption.manualChunks, {
          apply(target, thisArg, argArray) {
            const id = argArray[0]
            //  if id is in shared dependencies, return id ,else return vite function value
            const find = provideShared.find((arr) =>
              arr[1].dependencies.has(id)
            )
            return find ? find[0] : target(argArray[0], argArray[1])
          }
        })
      }
      return outputOption
    },

    generateBundle: function (options, bundle) {
      // find the shared and __rf_fn_import chunk
      let importFnChunk: RenderedChunk | undefined
      for (const file in bundle) {
        const chunk = bundle[file]
        if (chunk.type === 'chunk') {
          if (chunk.name.startsWith('__rf_input_')) {
            const sharedName = chunk.name.match(/(?<=__rf_input__).*/)?.[0]
            const sharedProp = provideShared.find(
              (item) => sharedName === item[0]
            )?.[1]
            if (!chunk.modules || !Reflect.ownKeys(chunk.modules).length) {
              const asMap = Object.create(null)
              let bindings: (string | string[])[] = []
              Object.entries(chunk.importedBindings).forEach(([, value]) => {
                bindings = bindings.concat(value)
              })
              for (let i = 0; i < chunk.exports.length; i++) {
                if (chunk.exports[i] != bindings[i]) {
                  asMap[bindings[i] as string] = chunk.exports[i]
                }
              }
              sharedProp.asMap = asMap
              sharedProp.fileName = path.basename(chunk.imports[0])
            } else {
              sharedProp.fileName = path.basename(chunk.fileName)
            }
            sharedProp.chunk = chunk
          } else if (chunk.name === getModuleMarker('import', 'fn')) {
            importFnChunk = chunk
          }
        }
      }

      if (importFnChunk && EXPOSES_CHUNK_SET.size && provideShared.length) {
        provideShared.forEach(
          (sharedInfo) =>
            (importFnChunk!.code = importFnChunk?.code?.replace(
              getModuleMarker('asMap', removeNonLetter(sharedInfo[0])),
              JSON.stringify(sharedInfo[1].asMap)
            ))
        )

        const obj = Object.create(null)
        // only need little field
        provideShared.forEach(
          (value) =>
            (obj[value[0]] = {
              import: value[1].import,
              requiredVersion: value[1].requiredVersion
            })
        )

        importFnChunk.code = importFnChunk.code?.replace(
          getModuleMarker('sharedInfo', 'var'),
          JSON.stringify(obj)
        )

        const needDynamicImportChunks = new Set(
          [...provideShared].map((sharedInfo) => sharedInfo[1].chunk)
        )
        EXPOSES_CHUNK_SET.forEach((exposeChunk) =>
          needDynamicImportChunks.add(exposeChunk)
        )
        needDynamicImportChunks.forEach((exposeChunk) => {
          findNeedChunks(exposeChunk)
        })

        // eslint-disable-next-line no-inner-declarations
        function findNeedChunks(
          chunk: OutputChunk | OutputAsset | RenderedChunk
        ): void {
          if (chunk?.type === 'chunk') {
            chunk.imports?.forEach((importTarget) => {
              if (!needDynamicImportChunks.has(bundle[importTarget])) {
                findNeedChunks(bundle[importTarget])
              }
            })
            if (!needDynamicImportChunks.has(chunk)) {
              needDynamicImportChunks.add(chunk)
            }
          }
        }

        needDynamicImportChunks.forEach((chunk) => {
          if (chunk.code) {
            let lastImport: any = null
            const ast = this.parse(chunk.code)
            const importMap = new Map()
            const magicString = new MagicString(chunk.code)
            walk(ast, {
              enter(node: any) {
                if (node.type === 'ImportDeclaration') {
                  const fileName = path.basename(node.source.value)
                  const sharedItem = provideShared.find(
                    (arr) => arr[1].fileName === fileName
                  )
                  const sharedName = sharedItem?.[0]
                  if (sharedName) {
                    importMap.set(sharedName, {
                      source: node.source.value,
                      specifiers: node.specifiers,
                      sharedItem: sharedItem?.[1]
                    })
                    //  replace import with empty
                    magicString.overwrite(node.start, node.end, '')
                  }
                  // record the last import to insert dynamic import code
                  lastImport = node
                }
              }
            })
            const fn_import = getModuleMarker('import', 'fn')
            //  generate variable declare
            const PLACEHOLDER_VAR = [...importMap.entries()]
              .map(([key, value]) => {
                let str = ''
                value.specifiers?.forEach((space) => {
                  str += `,${
                    space.imported.name === space.local.name
                      ? ''
                      : `${space.imported.name}:`
                  }${space.local.name}`
                })
                const sharedScope = value.sharedItem.shareScope
                if (str) {
                  return `const {${str.substring(
                    1
                  )}} = await importShared('${key}'${
                    sharedScope === 'default' ? '' : `,'${sharedScope}'`
                  });`
                }
              })
              .join('')
            if (PLACEHOLDER_VAR) {
              //  append code after lastImport
              magicString.prepend(
                `\nimport {importShared} from './${fn_import}.js'\n`
              )
              magicString.appendRight(lastImport.end, PLACEHOLDER_VAR)
            }
            chunk.code = magicString.toString()
          }
        })
      }
    }
  }
}
