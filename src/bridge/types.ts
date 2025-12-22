/**
 * MiracleBridge TypeScript 类型定义
 */

// ==================== 基础类型 ====================

export interface Position {
  x: number
  y: number
  z: number
}

export interface PlayerInfo {
  name: string
  uuid: string
  health: number
  maxHealth: number
  hunger: number
  level: number
  position: Position
  dimension: string
  gameMode: string
}

export interface InventorySlot {
  slot: number
  item: string
  count: number
  nbt?: Record<string, unknown>
}

export interface Inventory {
  slots: InventorySlot[]
}

// ==================== 学生相关 ====================

export interface Student {
  id: string
  name: string
  nameJP?: string
  club: string
  school: string
  birthday?: string
  age?: number
  height?: number
  affection: number
  affectionLevel: number
  position?: Position
  avatar: string
  portrait?: string
  isNearby: boolean
}

// ==================== 聊天相关 ====================

export interface ChatMessage {
  id: string
  sender: 'player' | 'student'
  studentId?: string
  content: string
  timestamp: number
  type: 'text' | 'image' | 'sticker'
}

export interface Conversation {
  studentId: string
  student: Student
  lastMessage?: ChatMessage
  unreadCount: number
  updatedAt: number
}

// ==================== 任务相关 ====================

export interface Task {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'special'
  status: 'available' | 'in_progress' | 'completed' | 'claimed'
  progress: number
  maxProgress: number
  rewards: TaskReward[]
  expiresAt?: number
}

export interface TaskReward {
  type: 'item' | 'exp' | 'affection'
  itemId?: string
  amount: number
  icon?: string
}

// ==================== 事件类型 ====================

export interface PlayerChatEvent {
  sender: string
  message: string
  timestamp: number
}

export interface PlayerJoinEvent {
  name: string
  uuid: string
}

export interface EntitySpawnEvent {
  entityId: string
  type: string
  position: Position
}

export interface StudentMessageEvent {
  studentId: string
  message: ChatMessage
}

export interface TaskCompleteEvent {
  taskId: string
  task: Task
}

// ==================== Anima 相关类型 ====================

/**
 * Anima 学生信息（从后端获取）
 */
export interface AnimaStudent {
  id: string
  name: string
  nameEn?: string
  school?: string
  club?: string
  role?: string
  hasActiveSession: boolean
  historySize?: number
}

/**
 * Anima 聊天请求响应
 */
export interface AnimaChatResponse {
  success: boolean
  requestId?: string
  error?: string
}

/**
 * Anima 学生回复事件
 */
export interface AnimaStudentReplyEvent {
  requestId: string
  studentId: string
  success: boolean
  content?: string
  error?: string
  promptTokens?: number
  completionTokens?: number
}

/**
 * Anima 获取学生列表响应
 */
export interface AnimaGetStudentsResponse {
  success: boolean
  students: AnimaStudent[]
  error?: string
}

/**
 * Anima 获取单个学生响应
 */
export interface AnimaGetStudentResponse {
  success: boolean
  student?: AnimaStudent
  error?: string
}

// ==================== Bridge API 类型 ====================

export type BridgeEventMap = {
  'player:join': PlayerJoinEvent
  'player:leave': PlayerJoinEvent
  'player:chat': PlayerChatEvent
  'player:death': { cause: string }
  'player:respawn': { position: Position }
  'entity:spawn': EntitySpawnEvent
  'entity:death': { entityId: string; cause: string }
  'world:load': { dimension: string }
  'world:unload': { dimension: string }
  'student:message': StudentMessageEvent
  'task:complete': TaskCompleteEvent
  // Anima 事件
  'studentReply': AnimaStudentReplyEvent
}

export type BridgeEventName = keyof BridgeEventMap

export interface BridgeConfig {
  timeout: number
  debug: boolean
  pollInterval: number
}

export interface BridgeStatus {
  ready: boolean
  pendingRequests: number
  eventListeners: string[]
  config: BridgeConfig
}

// ==================== 全局 Window 扩展 ====================

declare global {
  interface Window {
    MiracleBridge: {
      _initialized: boolean
      VERSION: string
      configure: (options: Partial<BridgeConfig>) => void
      isReady: () => boolean
      whenReady: () => Promise<void>
      call: <T = unknown>(action: string, payload?: Record<string, unknown>) => Promise<T>
      callServer: <T = unknown>(action: string, payload?: Record<string, unknown>) => Promise<T>
      on: <K extends BridgeEventName>(eventName: K, callback: (data: BridgeEventMap[K]) => void) => void
      off: <K extends BridgeEventName>(eventName: K, callback: (data: BridgeEventMap[K]) => void) => void
      once: <K extends BridgeEventName>(eventName: K, callback: (data: BridgeEventMap[K]) => void) => void
      getPlayerInfo: () => Promise<PlayerInfo>
      getInventory: () => Promise<Inventory>
      teleport: (x: number, y: number, z: number) => Promise<void>
      sendChat: (message: string) => Promise<void>
      executeCommand: (command: string) => Promise<void>
      enableDebug: () => void
      getStatus: () => BridgeStatus
    }
    __miracleBridgeSubmitRequest?: (requestId: string, action: string, payload: string) => void
    __miracleBridgeHandleResponse?: (requestId: string, success: boolean, data: string) => void
    __miracleBridgeHandleEvent?: (eventName: string, data: string) => void
  }
}

export {}
