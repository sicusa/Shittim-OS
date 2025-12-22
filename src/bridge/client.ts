/**
 * MiracleBridge 客户端封装
 * 
 * 提供类型安全的 Bridge API 访问
 * 
 * 通信方式优先级：
 * 1. HTTP API (http://127.0.0.1:25555/api/) - 内置服务器或开发服务器
 * 2. window.MiracleBridge SDK - JS 注入方式
 * 3. Mock 模式 - 开发/测试用
 */

import type { 
  PlayerInfo, 
  Inventory, 
  BridgeConfig,
  BridgeStatus,
  BridgeEventMap,
  BridgeEventName,
  AnimaChatResponse,
  AnimaGetStudentsResponse,
  AnimaGetStudentResponse,
  AnimaStudentReplyEvent,
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
 * 优先检查 HTTP API，然后检查 window.MiracleBridge
 */
export async function waitForBridge(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return true // SSR 环境，假设就绪
  }

  // 首先尝试检查 HTTP API 是否可用
  const httpAvailable = await bridge.checkBridgeAvailability()
  if (httpAvailable) {
    console.log('[MiracleBridge] HTTP API available')
    return true
  }

  // 如果 HTTP 不可用，等待 window.MiracleBridge
  if (!window.MiracleBridge) {
    await new Promise<void>((resolve) => {
      const checkInterval = setInterval(() => {
        if (window.MiracleBridge) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)

      // 1秒超时（已经等了 HTTP 检测时间）
      setTimeout(() => {
        clearInterval(checkInterval)
        console.log('[MiracleBridge] Minecraft not detected, entering mock mode')
        resolve()
      }, 1000)
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
  private _mockModeOverride: boolean | null = null
  private _bridgeAvailable: boolean | null = null
  private _checkingAvailability = false
  private _apiBaseUrl: string | null = null
  
  /**
   * 内置服务器默认端口
   */
  private static readonly DEFAULT_EMBEDDED_PORT = 25555

  /**
   * 动态检测是否处于 Mock 模式
   * Bridge 可能在运行时变为可用状态
   */
  private get mockMode(): boolean {
    // 如果强制设置了模式，使用设置的值
    if (this._mockModeOverride !== null) {
      return this._mockModeOverride
    }

    // SSR 环境
    if (typeof window === 'undefined') {
      return true
    }

    // 如果已经确认 bridge 可用
    if (this._bridgeAvailable === true) {
      return false
    }

    // 检查 window.MiracleBridge 是否存在且就绪
    if (window.MiracleBridge?.isReady?.()) {
      this._bridgeAvailable = true
      return false
    }

    // 如果 bridge 不可用，默认进入 Mock 模式
    // 避免调用失败导致 UI 崩溃
    if (this._bridgeAvailable === false) {
      return true
    }

    // 未确定状态，返回 false 让实际调用来验证
    return false
  }

  /**
   * 强制设置 Mock 模式（用于测试或特殊情况）
   */
  setMockMode(enabled: boolean | null): void {
    this._mockModeOverride = enabled
    console.log(`[BridgeClient] Mock mode ${enabled === null ? 'auto' : enabled ? 'enabled' : 'disabled'}`)
  }
  
  /**
   * 检测 Bridge API 是否可用
   * 通过尝试连接 HTTP API 来检测
   */
  async checkBridgeAvailability(): Promise<boolean> {
    if (this._bridgeAvailable !== null) {
      return this._bridgeAvailable
    }
    
    if (this._checkingAvailability) {
      // 等待正在进行的检查
      await new Promise(resolve => setTimeout(resolve, 100))
      return this._bridgeAvailable ?? false
    }
    
    this._checkingAvailability = true
    
    try {
      // 尝试连接内置服务器的 ping 端点
      const apiUrl = `http://127.0.0.1:${BridgeClient.DEFAULT_EMBEDDED_PORT}/api/ping`
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: '{}',
      })
      this._bridgeAvailable = response.ok
      if (this._bridgeAvailable) {
        this._apiBaseUrl = `http://127.0.0.1:${BridgeClient.DEFAULT_EMBEDDED_PORT}`
      }
    } catch {
      // HTTP API 不可用
      this._bridgeAvailable = false
    }
    
    this._checkingAvailability = false
    console.log(`[BridgeClient] Bridge availability: ${this._bridgeAvailable}`)
    return this._bridgeAvailable
  }

  /**
   * 配置 Bridge
   */
  configure(options: Partial<BridgeConfig>): void {
    if (this.mockMode) {
      console.log('[Mock] configure:', options)
      return
    }
    if (window.MiracleBridge?.configure) {
      window.MiracleBridge.configure(options)
    }
  }

  /**
   * 启用调试模式
   */
  enableDebug(): void {
    if (this.mockMode) {
      console.log('[Mock] debug enabled')
      return
    }
    if (window.MiracleBridge?.enableDebug) {
      window.MiracleBridge.enableDebug()
    }
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
    if (window.MiracleBridge?.getStatus) {
      return window.MiracleBridge.getStatus()
    }
    return {
      ready: true,
      pendingRequests: 0,
      eventListeners: [],
      config: { timeout: 30000, debug: false, pollInterval: 50 },
    }
  }

  /**
   * 调用 Bridge API
   * 优先使用 HTTP API，fallback 到 window.MiracleBridge
   */
  async call<T = unknown>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
    if (this.mockMode) {
      console.log('[Mock] call:', action, payload)
      return this.getMockResponse<T>(action)
    }
    
    // 尝试使用 HTTP API（内置服务器或开发服务器）
    const apiUrl = this.getApiUrl(action)
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) {
        throw new Error(`Bridge request failed: ${response.status} ${response.statusText}`)
      }
      
      const result = await response.json()
      
      // 检查响应中是否有错误
      if (result.error) {
        throw new Error(result.error)
      }
      
      return result as T
    } catch (fetchError) {
      // 如果 HTTP fetch 失败，尝试使用注入的 SDK
      console.debug('[BridgeClient] HTTP fetch failed, trying window.MiracleBridge:', fetchError)
      
      if (window.MiracleBridge?.call) {
        return window.MiracleBridge.call<T>(action, payload)
      }
      
      throw fetchError
    }
  }
  
  /**
   * 获取 API URL
   * 如果当前页面是从内置服务器加载的，使用同源 API
   * 否则尝试连接内置服务器
   */
  private getApiUrl(action: string): string {
    // 缓存的 API base URL
    if (this._apiBaseUrl) {
      return `${this._apiBaseUrl}/api/${action}`
    }
    
    // 检测当前页面来源
    const currentOrigin = window.location.origin
    
    // 如果是从 localhost 加载的（内置服务器或 Vite 开发服务器）
    if (currentOrigin.includes('127.0.0.1') || currentOrigin.includes('localhost')) {
      // 检查是否是内置服务器端口
      const port = window.location.port
      if (port === String(BridgeClient.DEFAULT_EMBEDDED_PORT)) {
        // 使用同源 API
        this._apiBaseUrl = currentOrigin
      } else {
        // 可能是 Vite 开发服务器，尝试连接内置服务器
        this._apiBaseUrl = `http://127.0.0.1:${BridgeClient.DEFAULT_EMBEDDED_PORT}`
      }
    } else {
      // 非 localhost，使用内置服务器
      this._apiBaseUrl = `http://127.0.0.1:${BridgeClient.DEFAULT_EMBEDDED_PORT}`
    }
    
    return `${this._apiBaseUrl}/api/${action}`
  }

  /**
   * 调用服务端 API
   */
  async callServer<T = unknown>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
    // 服务端调用与本地调用使用相同的 bridge:// 协议
    // 由 Java 端的 BridgeAPI 决定是否需要转发到服务端
    return this.call<T>(action, payload)
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
    
    // 同时使用 DOM 事件和 MiracleBridge.on
    if (typeof window !== 'undefined') {
      window.addEventListener(eventName, ((e: CustomEvent) => {
        callback(e.detail as BridgeEventMap[K])
      }) as EventListener)
    }
    
    if (window.MiracleBridge?.on) {
      window.MiracleBridge.on(eventName, callback)
    }
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
    
    // 安全地调用 MiracleBridge.off
    if (window.MiracleBridge?.off) {
      window.MiracleBridge.off(eventName, callback)
    }
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
    
    // 安全地调用 MiracleBridge.once
    if (window.MiracleBridge?.once) {
      window.MiracleBridge.once(eventName, callback)
    }
  }

  // ==================== 便捷方法 ====================

  /**
   * 获取玩家信息
   */
  async getPlayerInfo(): Promise<PlayerInfo> {
    if (this.mockMode) {
      return this.getMockPlayerInfo()
    }
    try {
      const result = await this.call<PlayerInfo>('getPlayerInfo')
      // 确保返回的数据包含所有必要字段
      if (!result.position) {
        result.position = { x: 0, y: 64, z: 0 }
      }
      return result
    } catch (error) {
      console.warn('[BridgeClient] getPlayerInfo failed, using mock data:', error)
      return this.getMockPlayerInfo()
    }
  }

  /**
   * 获取背包
   */
  async getInventory(): Promise<Inventory> {
    if (this.mockMode) {
      return { slots: [] }
    }
    // 使用 bridge:// 协议
    return this.call<Inventory>('getInventory')
  }

  /**
   * 传送玩家
   */
  async teleport(x: number, y: number, z: number): Promise<void> {
    if (this.mockMode) {
      console.log('[Mock] teleport:', x, y, z)
      return
    }
    // 使用 bridge:// 协议
    await this.call('teleport', { x, y, z })
  }

  /**
   * 发送聊天消息
   */
  async sendChat(message: string): Promise<void> {
    if (this.mockMode) {
      console.log('[Mock] sendChat:', message)
      return
    }
    // 使用 bridge:// 协议
    await this.call('sendChat', { message })
  }

  /**
   * 执行命令
   */
  async executeCommand(command: string): Promise<void> {
    if (this.mockMode) {
      console.log('[Mock] executeCommand:', command)
      return
    }
    // 使用 bridge:// 协议
    await this.call('executeCommand', { command })
  }

  // ==================== Anima API ====================

  /**
   * 发送聊天消息给学生
   * 返回 requestId，实际回复通过 studentReply 事件推送
   */
  async animaChat(studentId: string, message: string): Promise<AnimaChatResponse> {
    if (this.mockMode) {
      console.log('[Mock] anima.chat:', studentId, message)
      // Mock 模式下模拟异步回复
      const requestId = `mock-${Date.now()}`
      setTimeout(() => {
        this.mockStudentReply(requestId, studentId, message)
      }, 1000 + Math.random() * 1000)
      return { success: true, requestId }
    }
    return this.call<AnimaChatResponse>('anima.chat', { studentId, message })
  }

  /**
   * 获取所有可用学生列表
   */
  async animaGetStudents(): Promise<AnimaGetStudentsResponse> {
    if (this.mockMode) {
      console.log('[Mock] anima.getStudents')
      return {
        success: true,
        students: [
          { id: 'arona', name: '阿罗娜', nameEn: 'Arona', school: '联邦学生会', club: 'Shittim 箱', role: '系统管理 AI', hasActiveSession: false }
        ]
      }
    }
    return this.call<AnimaGetStudentsResponse>('anima.getStudents', {})
  }

  /**
   * 获取单个学生信息
   */
  async animaGetStudent(studentId: string): Promise<AnimaGetStudentResponse> {
    if (this.mockMode) {
      console.log('[Mock] anima.getStudent:', studentId)
      if (studentId.toLowerCase() === 'arona') {
        return {
          success: true,
          student: { id: 'arona', name: '阿罗娜', nameEn: 'Arona', school: '联邦学生会', club: 'Shittim 箱', role: '系统管理 AI', hasActiveSession: false }
        }
      }
      return { success: false, error: '未找到学生' }
    }
    return this.call<AnimaGetStudentResponse>('anima.getStudent', { studentId })
  }

  /**
   * 清空对话历史
   */
  async animaClearHistory(studentId?: string): Promise<{ success: boolean; error?: string }> {
    if (this.mockMode) {
      console.log('[Mock] anima.clearHistory:', studentId)
      return { success: true }
    }
    return this.call<{ success: boolean; error?: string }>('anima.clearHistory', studentId ? { studentId } : {})
  }

  /**
   * 监听学生回复事件
   */
  onStudentReply(callback: (data: AnimaStudentReplyEvent) => void): void {
    this.on('studentReply', callback)
  }

  /**
   * 取消监听学生回复事件
   */
  offStudentReply(callback: (data: AnimaStudentReplyEvent) => void): void {
    this.off('studentReply', callback)
  }
  
  private mockStudentReply(requestId: string, studentId: string, _userMessage: string): void {
    // 简单的 mock 回复逻辑
    const replies: Record<string, string[]> = {
      'arona': [
        '老师，早上好~！今天也要一起加油哦！(≧▽≦)',
        '阿罗娜会一直陪着老师的！',
        '嘿嘿，老师说的话阿罗娜都记住了~',
        '老师有什么需要帮忙的吗？阿罗娜随时待命！',
      ]
    }
    const studentReplies = replies[studentId.toLowerCase()] || ['收到老师的消息了~']
    const content = studentReplies[Math.floor(Math.random() * studentReplies.length)]
    
    const eventData: AnimaStudentReplyEvent = {
      requestId,
      studentId,
      success: true,
      content,
      promptTokens: 100,
      completionTokens: 50,
    }
    
    // 触发事件回调
    if (this.mockMode && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('studentReply', { detail: eventData }))
    }
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
