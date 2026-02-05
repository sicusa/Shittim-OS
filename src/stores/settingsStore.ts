import { createStore } from 'zustand'
import { persist, combine, subscribeWithSelector } from 'zustand/middleware'
import { wrapUseStore } from './common'

export const settingsStore = createStore(
  persist(subscribeWithSelector(combine(
    {
      zoom: 100,
      volume: 80,
      notifications: true,
      debugMode: false,
    },
    (set) => ({
      setZoom: (zoom: number) => set({ zoom }),
      setVolume: (volume: number) => set({ volume }),
      setNotifications: (notifications: boolean) => set({ notifications }),
      setDebugMode: (debugMode: boolean) => set({ debugMode }),
    })
  )),
  {
    name: "shittim-settings",
    version: 1,
  })
)

export const useSettingsStore = wrapUseStore(settingsStore)

settingsStore.subscribe(s => s.zoom, zoom => {
  const scale = zoom / 100
  document.documentElement.style.setProperty('--browser-zoom', String(scale))
  document.body.style.transform = `scale(${scale})`
  document.body.style.transformOrigin = 'top left'
  document.body.style.width = `${100 / scale}%`
  document.body.style.height = `${100 / scale}%`
}, { fireImmediately: true })

settingsStore.subscribe(s => s.debugMode, debug => {
  window.MiracleBridge?.configure({ debug })
}, { fireImmediately: true })