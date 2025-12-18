/**
 * MiracleBridge 客户端封装
 * 
 * 提供类型安全的 Bridge API 访问
 */

import type { 
  PlayerInfo, 
  Inventory, 
  BridgeConfig,
  BridgeStatus,
  BridgeEventMap,
  BridgeEventName,
} from './types'

/**
 * 检查 Bridge 是否可用
 */
export function isBridgeAvailable(): boolean {
  return typeof window !== 'undefined' && 
         typeof window.MiracleBridge !== 'undefined' &&
         window.MiracleBridge.isReady()
}

/**
 * 等待 Bridge 就绪
 * 在 Mock 模式下会在短暂等待后返回 true
 */
export async function waitForBridge(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return true // SSR 环境，假设就绪
  }

  // 如果 MiracleBridge 不存在，等待它加载
  if (!window.MiracleBridge) {
    await new Promise<void>((resolve) => {
      const checkInterval = setInterval(() => {
        if (window.MiracleBridge) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)

      // 2秒超时后进入 Mock 模式
      setTimeout(() => {
        clearInterval(checkInterval)
        console.log('[MiracleBridge] Minecraft not detected, entering mock mode')
        resolve()
      }, 2000)
    })
  }

  if (window.MiracleBridge) {
    await window.MiracleBridge.whenReady()
    return window.MiracleBridge.isReady()
  }

  // Mock 模式也返回 true，让 UI 正常显示
  return true
}

/**
 * Bridge 客户端类
 */
class BridgeClient {
  private mockMode = false

  constructor() {
    // 检测是否需要 mock 模式
    if (typeof window !== 'undefined' && !window.MiracleBridge) {
      console.warn('[BridgeClient] MiracleBridge not found, entering mock mode')
      this.mockMode = true
    }
  }

  /**
   * 配置 Bridge
   */
  configure(options: Partial<BridgeConfig>): void {
    if (this.mockMode) {
      console.log('[Mock] configure:', options)
      return
    }
    window.MiracleBridge.configure(options)
  }

  /**
   * 启用调试模式
   */
  enableDebug(): void {
    if (this.mockMode) {
      console.log('[Mock] debug enabled')
      return
    }
    window.MiracleBridge.enableDebug()
  }

  /**
   * 获取状态
   */
  getStatus(): BridgeStatus {
    if (this.mockMode) {
      return {
        ready: false,
        pendingRequests: 0,
        eventListeners: [],
        config: { timeout: 30000, debug: false, pollInterval: 50 },
      }
    }
    return window.MiracleBridge.getStatus()
  }

  /**
   * 调用 Bridge API
   */
  async call<T = unknown>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
    if (this.mockMode) {
      console.log('[Mock] call:', action, payload)
      return this.getMockResponse<T>(action)
    }
    return window.MiracleBridge.call<T>(action, payload)
  }

  /**
   * 调用服务端 API
   */
  async callServer<T = unknown>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
    if (this.mockMode) {
      console.log('[Mock] callServer:', action, payload)
      return this.getMockResponse<T>(action)
    }
    return window.MiracleBridge.callServer<T>(action, payload)
  }

  /**
   * 监听事件
   */
  on<K extends BridgeEventName>(
    eventName: K, 
    callback: (data: BridgeEventMap[K]) => void
  ): void {
    if (this.mockMode) {
      console.log('[Mock] on:', eventName)
      return
    }
    window.MiracleBridge.on(eventName, callback)
  }

  /**
   * 取消监听
   */
  off<K extends BridgeEventName>(
    eventName: K, 
    callback: (data: BridgeEventMap[K]) => void
  ): void {
    if (this.mockMode) {
      console.log('[Mock] off:', eventName)
      return
    }
    window.MiracleBridge.off(eventName, callback)
  }

  /**
   * 单次监听
   */
  once<K extends BridgeEventName>(
    eventName: K, 
    callback: (data: BridgeEventMap[K]) => void
  ): void {
    if (this.mockMode) {
      console.log('[Mock] once:', eventName)
      return
    }
    window.MiracleBridge.once(eventName, callback)
  }

  // ==================== 便捷方法 ====================

  /**
   * 获取玩家信息
   */
  async getPlayerInfo(): Promise<PlayerInfo> {
    if (this.mockMode) {
      return this.getMockPlayerInfo()
    }
    return window.MiracleBridge.getPlayerInfo()
  }

  /**
   * 获取背包
   */
  async getInventory(): Promise<Inventory> {
    if (this.mockMode) {
      return { slots: [] }
    }
    return window.MiracleBridge.getInventory()
  }

  /**
   * 传送玩家
   */
  async teleport(x: number, y: number, z: number): Promise<void> {
    if (this.mockMode) {
      console.log('[Mock] teleport:', x, y, z)
      return
    }
    return window.MiracleBridge.teleport(x, y, z)
  }

  /**
   * 发送聊天消息
   */
  async sendChat(message: string): Promise<void> {
    if (this.mockMode) {
      console.log('[Mock] sendChat:', message)
      return
    }
    return window.MiracleBridge.sendChat(message)
  }

  /**
   * 执行命令
   */
  async executeCommand(command: string): Promise<void> {
    if (this.mockMode) {
      console.log('[Mock] executeCommand:', command)
      return
    }
    return window.MiracleBridge.executeCommand(command)
  }

  // ==================== Mock 数据 ====================

  private getMockPlayerInfo(): PlayerInfo {
    return {
      name: 'Sensei',
      uuid: '00000000-0000-0000-0000-000000000000',
      health: 20,
      maxHealth: 20,
      hunger: 20,
      level: 1,
      position: { x: 0, y: 64, z: 0 },
      dimension: 'minecraft:overworld',
      gameMode: 'survival',
    }
  }

  private getMockResponse<T>(action: string): T {
    // 根据 action 返回不同的 mock 数据
    const mockResponses: Record<string, unknown> = {
      'getPlayerInfo': this.getMockPlayerInfo(),
      'getInventory': { slots: [] },
      'getStudents': [],
      'getTasks': [],
    }
    return (mockResponses[action] ?? { success: true }) as T
  }
}

// 导出单例
export const bridge = new BridgeClient()
