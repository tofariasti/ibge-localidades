import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  isModuleEnabled,
  modulesSnapshot,
  parseModulesParam,
  persistModules,
  readStoredModules,
  resolveEnabledModules,
  serializeModulesParam,
  subscribeModules,
  type ModuleId,
} from '../lib/modules'

export function useModules() {
  const [searchParams, setSearchParams] = useSearchParams()
  const storageEpoch = useSyncExternalStore(
    subscribeModules,
    modulesSnapshot,
    () => '',
  )

  const queryIds = useMemo(
    () => parseModulesParam(searchParams.get('modulos')),
    [searchParams],
  )

  const enabled = useMemo(() => {
    void storageEpoch
    return resolveEnabledModules(queryIds)
  }, [queryIds, storageEpoch])

  const isEnabled = useCallback(
    (id: ModuleId) => isModuleEnabled(enabled, id),
    [enabled],
  )

  const setOptionalEnabled = useCallback(
    (id: ModuleId, on: boolean) => {
      const current =
        readStoredModules() ??
        [...enabled].filter((mid) => mid !== 'indicadores')
      const next = new Set(current)
      if (on) next.add(id)
      else next.delete(id)
      persistModules([...next])

      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev)
          const fromQuery = parseModulesParam(params.get('modulos'))
          const merged = new Set(fromQuery)
          if (on) merged.add(id)
          else merged.delete(id)
          const serialized = serializeModulesParam([...merged])
          if (serialized) params.set('modulos', serialized)
          else params.delete('modulos')
          return params
        },
        { replace: true },
      )
    },
    [enabled, setSearchParams],
  )

  return { enabled, isEnabled, setOptionalEnabled, queryIds }
}
