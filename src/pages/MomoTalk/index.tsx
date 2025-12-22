import { useState, useEffect, useRef, useCallback } from 'react'
import { bridge } from '../../bridge'
import type { AnimaStudentReplyEvent } from '../../bridge/types'
import { useRegisteredStudents } from '../../bridge/useRegisteredStudents'
import { getDefaultPortrait, students as allStudents, clubInfo } from '../../data'

// ==================== 存储相关 ====================

const STORAGE_KEY = 'momotalk_conversations'

// 消息类型
interface Message {
  id: string
  sender: 'player' | 'student'
  content: string
  time: string
  pending?: boolean
}

// 对话类型（持久化）
interface Conversation {
  studentId: string
  name: string
  avatar: string | null
  lastMessage: string
  time: string
  unreadCount: number
  messages: Message[]
}

// 持久化数据结构
interface StoredData {
  version: number
  conversations: Array<{
    studentId: string
    messages: Message[]
    lastMessage: string
    time: string
  }>
}

// 保存对话到 localStorage
function saveConversations(conversations: Conversation[]): void {
  try {
    const data: StoredData = {
      version: 1,
      conversations: conversations.map(conv => ({
        studentId: conv.studentId,
        messages: conv.messages.filter(m => !m.pending), // 不保存 pending 消息
        lastMessage: conv.lastMessage,
        time: conv.time,
      })),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    console.log('[MomoTalk] 已保存对话记录')
  } catch (error) {
    console.error('[MomoTalk] 保存对话记录失败:', error)
  }
}

// 从 localStorage 加载对话
function loadConversations(): Conversation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return createDefaultConversations()
    }
    
    const data: StoredData = JSON.parse(stored)
    
    // 版本迁移（未来可扩展）
    if (data.version !== 1) {
      console.warn('[MomoTalk] 对话数据版本不匹配，使用默认数据')
      return createDefaultConversations()
    }
    
    // 合并存储的数据和默认对话列表
    const defaults = createDefaultConversations()
    const loaded: Conversation[] = []
    
    // 先加载已存储的对话
    for (const stored of data.conversations) {
      const defaultConv = defaults.find(d => d.studentId === stored.studentId)
      loaded.push({
        studentId: stored.studentId,
        name: defaultConv?.name ?? stored.studentId,
        avatar: getDefaultPortrait(stored.studentId),
        lastMessage: stored.lastMessage || (defaultConv?.lastMessage ?? ''),
        time: stored.time || '之前',
        unreadCount: 0,
        messages: stored.messages || [],
      })
    }
    
    // 添加默认对话中未存储的
    for (const def of defaults) {
      if (!loaded.find(l => l.studentId === def.studentId)) {
        loaded.push(def)
      }
    }
    
    console.log('[MomoTalk] 已加载对话记录:', loaded.length, '个对话')
    return loaded
  } catch (error) {
    console.error('[MomoTalk] 加载对话记录失败:', error)
    return createDefaultConversations()
  }
}

// 从本地数据获取学生信息
function _getStudentInfo(studentId: string) {
  const student = allStudents.find(s => s.id === studentId || s.id.toLowerCase() === studentId.toLowerCase())
  return {
    name: student?.name ?? studentId,
    avatar: getDefaultPortrait(studentId),
    club: student ? clubInfo[student.club]?.name : '',
  }
}

// 导出以避免 unused 警告（未来可能使用）
export { _getStudentInfo as getStudentInfo }

// 生成时间字符串
function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

// 创建默认对话列表（空列表，等待从后端获取）
function createDefaultConversations(): Conversation[] {
  return []
}

export function MomoTalkPage() {
  // 获取已注册学生
  const { students: registeredStudents, loading: studentsLoading, error: studentsError } = useRegisteredStudents()
  
  // 从 localStorage 加载对话记录
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  const selected = conversations.find(c => c.studentId === selectedId)

  // 当注册学生列表更新时，同步对话列表
  useEffect(() => {
    if (studentsLoading || registeredStudents.length === 0) return
    
    // 加载已存储的对话
    const stored = loadConversations()
    
    // 合并：已注册学生 + 已存储的消息
    const merged: Conversation[] = registeredStudents.map(student => {
      const studentIdLower = student.animaData.id.toLowerCase()
      // 查找已存储的对话（支持大小写匹配）
      const existingConv = stored.find(
        c => c.studentId.toLowerCase() === studentIdLower || 
             c.studentId.toLowerCase() === student.id.toLowerCase()
      )
      
      return {
        studentId: student.animaData.id, // 使用后端 ID
        name: student.name,
        avatar: student.avatar || getDefaultPortrait(student.id),
        lastMessage: existingConv?.lastMessage || 
                     (student.historySize > 0 ? '点击继续对话...' : '老师，有什么需要帮忙的吗？'),
        time: existingConv?.time || (student.hasActiveSession ? '刚刚' : '之前'),
        unreadCount: 0,
        messages: existingConv?.messages || [],
      }
    })
    
    setConversations(merged)
    console.log('[MomoTalk] 已同步对话列表，共', merged.length, '个对话')
  }, [registeredStudents, studentsLoading])

  // 当对话更新时自动保存
  useEffect(() => {
    // 避免初始化时立即保存
    const timer = setTimeout(() => {
      saveConversations(conversations)
    }, 500)
    return () => clearTimeout(timer)
  }, [conversations])

  // 处理收到的回复
  const handleStudentReply = useCallback((data: AnimaStudentReplyEvent) => {
    console.log('[MomoTalk] 收到回复:', data)
    
    if (!data.success) {
      console.error('[MomoTalk] 回复失败:', data.error)
      // TODO: 显示错误消息
      return
    }
    
    setConversations(prev => prev.map(conv => {
      if (conv.studentId.toLowerCase() === data.studentId.toLowerCase()) {
        // 移除 pending 消息，添加真实回复
        const newMessages = conv.messages
          .filter(m => !m.pending)
          .concat({
            id: `reply-${Date.now()}`,
            sender: 'student',
            content: data.content || '',
            time: formatTime(new Date()),
          })
        
        return {
          ...conv,
          messages: newMessages,
          lastMessage: data.content?.substring(0, 30) || '',
          time: '刚刚',
        }
      }
      return conv
    }))
  }, [])

  // 监听学生回复事件
  // 只使用 window 事件监听，避免重复触发
  useEffect(() => {
    const handleWindowEvent = (e: Event) => {
      const customEvent = e as CustomEvent<AnimaStudentReplyEvent>
      handleStudentReply(customEvent.detail)
    }
    window.addEventListener('studentReply', handleWindowEvent)
    
    return () => {
      window.removeEventListener('studentReply', handleWindowEvent)
    }
  }, [handleStudentReply])

  // 发送消息
  const handleSendMessage = useCallback(async (studentId: string, message: string) => {
    // 添加用户消息
    setConversations(prev => prev.map(conv => {
      if (conv.studentId === studentId) {
        return {
          ...conv,
          messages: [...conv.messages, {
            id: `user-${Date.now()}`,
            sender: 'player' as const,
            content: message,
            time: formatTime(new Date()),
          }],
          lastMessage: message.substring(0, 30),
          time: '刚刚',
        }
      }
      return conv
    }))

    // 调用 Anima API
    try {
      const response = await bridge.animaChat(studentId, message)
      console.log('[MomoTalk] 发送消息响应:', response)
      
      if (!response.success) {
        console.error('[MomoTalk] 发送失败:', response.error)
        // TODO: 显示错误提示
      }
      // 实际回复会通过 studentReply 事件推送
    } catch (error) {
      console.error('[MomoTalk] 发送消息异常:', error)
    }
  }, [])

  // 加载状态
  if (studentsLoading) {
    return (
      <div className="flex h-full items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">💬</div>
          <p className="text-gray-500">正在连接 Anima...</p>
        </div>
      </div>
    )
  }

  // 错误状态
  if (studentsError) {
    return (
      <div className="flex h-full items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-gray-500 mb-2">无法连接 Anima</p>
          <p className="text-sm text-gray-400">{studentsError.message}</p>
        </div>
      </div>
    )
  }

  // 空状态（无已注册学生）
  if (conversations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-500 mb-2">暂无可对话的学生</p>
          <p className="text-sm text-gray-400">在 Anima 中注册学生后即可开始对话</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full gap-4 animate-fade-in">
      {/* 对话列表 */}
      <div className="w-80 card overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">MomoTalk</h2>
        </div>
        <div className="flex-1 overflow-auto">
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.studentId}
              studentId={conv.studentId}
              name={conv.name}
              avatar={conv.avatar}
              lastMessage={conv.lastMessage}
              unreadCount={conv.unreadCount}
              time={conv.time}
              isActive={conv.studentId === selectedId}
              onClick={() => setSelectedId(conv.studentId)}
            />
          ))}
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 card overflow-hidden flex flex-col">
        {selected ? (
          <ChatArea 
            key={selected.studentId}
            student={{
              studentId: selected.studentId,
              name: selected.name,
              avatar: selected.avatar,
            }}
            messages={selected.messages}
            onSendMessage={(message) => handleSendMessage(selected.studentId, message)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <p>选择一个对话开始聊天</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface ConversationItemProps {
  studentId: string
  name: string
  avatar: string | null
  lastMessage: string
  unreadCount: number
  time: string
  isActive: boolean
  onClick: () => void
}

function ConversationItem({
  name,
  avatar,
  lastMessage,
  unreadCount,
  time,
  isActive,
  onClick,
}: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 flex items-center gap-3 transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-primary/15 to-primary/5 border-l-4 border-primary' 
          : 'hover:bg-pink-50/50 border-l-4 border-transparent'
      }`}
    >
      {/* 头像 */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center overflow-hidden shadow-sm border border-pink-100/50">
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl font-bold text-primary/60">{name.charAt(0)}</span>
        )}
      </div>

      {/* 信息 */}
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700 truncate">{name}</span>
          <span className="text-xs text-gray-400 flex-shrink-0">{time}</span>
        </div>
        <p className="text-sm text-gray-500 truncate mt-0.5">{lastMessage}</p>
      </div>

      {/* 未读标记 */}
      {unreadCount > 0 && (
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-xs flex items-center justify-center font-medium shadow-sm">
          {unreadCount}
        </div>
      )}
    </button>
  )
}

interface ChatAreaProps {
  student: {
    studentId: string
    name: string
    avatar: string | null
  }
  messages: Message[]
  onSendMessage: (message: string) => void
}

function ChatArea({ student, messages, onSendMessage }: ChatAreaProps) {
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isSending) return
    
    const message = input.trim()
    setInput('')
    setIsSending(true)
    
    onSendMessage(message)
    
    // 短暂延迟后恢复发送状态
    setTimeout(() => setIsSending(false), 500)
  }

  return (
    <>
      {/* 头部 */}
      <div className="p-4 border-b border-pink-100/50 flex items-center gap-3 bg-gradient-to-r from-white to-pink-50/30">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center overflow-hidden shadow-sm border border-pink-100/50">
          {student.avatar ? (
            <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-primary/60">{student.name.charAt(0)}</span>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-700">{student.name}</h3>
          <p className="text-xs text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            在线
          </p>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-auto p-4 space-y-4 bg-gradient-to-b from-white/50 to-transparent">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>发送消息开始对话...</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.sender === 'player' ? 'justify-end' : 'justify-start'}`}
            >
              {/* 学生头像 */}
              {msg.sender === 'student' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-100 to-pink-50 flex-shrink-0 overflow-hidden shadow-sm border border-pink-100/50">
                  {student.avatar ? (
                    <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-sm font-bold text-primary/60">
                      {student.name.charAt(0)}
                    </span>
                  )}
                </div>
              )}
              
              <div
                className={`chat-bubble ${
                  msg.sender === 'player' ? 'chat-bubble-right' : 'chat-bubble-left'
                } ${msg.pending ? 'opacity-60' : ''}`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender === 'player' ? 'text-white/70' : 'text-gray-400'
                }`}>
                  {msg.time}
                  {msg.pending && ' (发送中...)'}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <div className="p-4 border-t border-pink-100/50 bg-white/80">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="输入消息..."
            disabled={isSending}
            className="flex-1 px-4 py-2.5 rounded-full border border-pink-200/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-pink-50/30 placeholder:text-gray-400 transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="px-5 py-2.5 rounded-full font-medium transition-all duration-200 bg-gradient-to-r from-primary to-primary-dark text-white shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-sm"
          >
            {isSending ? '...' : '发送'}
          </button>
        </div>
      </div>
    </>
  )
}
