/**
 * MiracleBridge React Hooks
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { bridge, waitForBridge } from './client'
import type { 
  PlayerInfo, 
  BridgeEventMap, 
  BridgeEventName,
} from './types'

/**
 * Bridge 就绪状态 Hook
 */
export function useBridgeReady(): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    waitForBridge().then(setReady)
  }, [])

  return ready
}

/**
 * 玩家信息 Hook
 */
export function usePlayer() {
  const [player, setPlayer] = useState<PlayerInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      const info = await bridge.getPlayerInfo()
      setPlayer(info)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { player, loading, error, refresh }
}

/**
 * 游戏事件订阅 Hook
 */
export function useGameEvent<K extends BridgeEventName>(
  eventName: K,
  handler: (data: BridgeEventMap[K]) => void
): void {
  // 使用 ref 保持 handler 引用稳定
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    const callback = (data: BridgeEventMap[K]) => {
      handlerRef.current(data)
    }

    bridge.on(eventName, callback)
    return () => {
      bridge.off(eventName, callback)
    }
  }, [eventName])
}

/**
 * Bridge API 调用 Hook
 */
export function useBridgeCall<T = unknown>(
  action: string,
  payload?: Record<string, unknown>,
  options?: { immediate?: boolean }
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async (overridePayload?: Record<string, unknown>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await bridge.call<T>(action, overridePayload ?? payload)
      setData(result)
      return result
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [action, payload])

  useEffect(() => {
    if (options?.immediate !== false) {
      execute()
    }
  }, [execute, options?.immediate])

  return { data, loading, error, execute }
}

/**
 * 聊天消息监听 Hook
 */
export function useChatMessages() {
  const [messages, setMessages] = useState<BridgeEventMap['player:chat'][]>([])

  useGameEvent('player:chat', (data) => {
    setMessages((prev) => [...prev, data])
  })

  const clear = useCallback(() => {
    setMessages([])
  }, [])

  return { messages, clear }
}
