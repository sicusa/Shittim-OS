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

settingsStore.subscribe(s => s.debugMode, debug => {
  window.MiracleBridge?.configure({ debug })
}, { fireImmediately: true })