import { useState } from 'react'
import { students, getDefaultPortrait, clubInfo } from '../../data'

// 根据学生数据生成对话列表
const mockConversations = [
  {
    studentId: 'ARIS',
    lastMessage: '老师！今天一起玩游戏吗？',
    unreadCount: 2,
    time: '刚刚',
  },
  {
    studentId: 'MOMOI',
    lastMessage: '新的游戏上线了...',
    unreadCount: 0,
    time: '5分钟前',
  },
  {
    studentId: 'MIDORI',
    lastMessage: '姐姐又在熬夜了...',
    unreadCount: 1,
    time: '10分钟前',
  },
  {
    studentId: 'YUZU',
    lastMessage: '代码写完了！',
    unreadCount: 0,
    time: '1小时前',
  },
  {
    studentId: 'HOSHINO',
    lastMessage: '午睡时间到了...',
    unreadCount: 0,
    time: '2小时前',
  },
  {
    studentId: 'SHIROKO',
    lastMessage: '银行的事情解决了',
    unreadCount: 1,
    time: '3小时前',
  },
  {
    studentId: 'HIMARI',
    lastMessage: '数据分析完成了~',
    unreadCount: 0,
    time: '昨天',
  },
  {
    studentId: 'YUUKA',
    lastMessage: '预算超支了老师...',
    unreadCount: 3,
    time: '昨天',
  },
]

// 获取学生信息
function getStudentInfo(studentId: string) {
  const student = students.find(s => s.id === studentId)
  return {
    name: student?.name ?? studentId,
    avatar: getDefaultPortrait(studentId),
    club: student ? clubInfo[student.club].name : '',
  }
}

export function MomoTalkPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = mockConversations.find(c => c.studentId === selectedId)
  const selectedInfo = selectedId ? getStudentInfo(selectedId) : null

  return (
    <div className="flex h-full gap-4 animate-fade-in">
      {/* 对话列表 */}
      <div className="w-80 card overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">MomoTalk</h2>
        </div>
        <div className="flex-1 overflow-auto">
          {mockConversations.map((conv) => {
            const info = getStudentInfo(conv.studentId)
            return (
              <ConversationItem
                key={conv.studentId}
                studentId={conv.studentId}
                name={info.name}
                avatar={info.avatar}
                lastMessage={conv.lastMessage}
                unreadCount={conv.unreadCount}
                time={conv.time}
                isActive={conv.studentId === selectedId}
                onClick={() => setSelectedId(conv.studentId)}
              />
            )
          })}
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 card overflow-hidden flex flex-col">
        {selected && selectedInfo ? (
          <ChatArea 
            key={selected.studentId}
            student={{
              studentId: selected.studentId,
              name: selectedInfo.name,
              avatar: selectedInfo.avatar,
            }} 
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
      {/* 头像 - 圆角方形 */}
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

      {/* 未读标记 - 粉色 */}
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
}

// 每个学生的 mock 消息数据
const mockMessagesMap: Record<string, Array<{ id: string; sender: 'student' | 'player'; content: string; time: string }>> = {
  ARIS: [
    { id: '1', sender: 'student', content: '老师！今天有空吗？', time: '10:00' },
    { id: '2', sender: 'player', content: '有空的，怎么了？', time: '10:01' },
    { id: '3', sender: 'student', content: '想和老师一起玩游戏！', time: '10:02' },
    { id: '4', sender: 'student', content: '老师！今天一起玩游戏吗？', time: '10:03' },
  ],
  MOMOI: [
    { id: '1', sender: 'student', content: '老师，新游戏发布了！', time: '09:30' },
    { id: '2', sender: 'player', content: '什么游戏？', time: '09:31' },
    { id: '3', sender: 'student', content: '是一款超棒的 RPG！', time: '09:32' },
    { id: '4', sender: 'student', content: '新的游戏上线了...', time: '09:35' },
  ],
  MIDORI: [
    { id: '1', sender: 'student', content: '老师...', time: '11:00' },
    { id: '2', sender: 'player', content: '怎么了绿？', time: '11:01' },
    { id: '3', sender: 'student', content: '姐姐又在熬夜打游戏了...', time: '11:02' },
    { id: '4', sender: 'student', content: '姐姐又在熬夜了...', time: '11:05' },
  ],
  YUZU: [
    { id: '1', sender: 'student', content: '老师，代码审查完成了！', time: '14:00' },
    { id: '2', sender: 'player', content: '辛苦了柚子！', time: '14:01' },
    { id: '3', sender: 'student', content: '嘿嘿，没什么啦~', time: '14:02' },
    { id: '4', sender: 'student', content: '代码写完了！', time: '14:05' },
  ],
  HOSHINO: [
    { id: '1', sender: 'student', content: '老师...好困...', time: '13:00' },
    { id: '2', sender: 'player', content: '又想睡觉了？', time: '13:01' },
    { id: '3', sender: 'student', content: '嗯...午睡时间...', time: '13:02' },
    { id: '4', sender: 'student', content: '午睡时间到了...', time: '13:05' },
  ],
  SHIROKO: [
    { id: '1', sender: 'student', content: '老师，任务完成了', time: '15:00' },
    { id: '2', sender: 'player', content: '做得好，白子', time: '15:01' },
    { id: '3', sender: 'student', content: '银行那边也处理好了', time: '15:02' },
    { id: '4', sender: 'student', content: '银行的事情解决了', time: '15:05' },
  ],
  HIMARI: [
    { id: '1', sender: 'student', content: '老师！数据分析报告出来了~', time: '16:00' },
    { id: '2', sender: 'player', content: '效率真高！', time: '16:01' },
    { id: '3', sender: 'student', content: '都是为了老师嘛~', time: '16:02' },
    { id: '4', sender: 'student', content: '数据分析完成了~', time: '16:05' },
  ],
  YUUKA: [
    { id: '1', sender: 'student', content: '老师，这个月的开支...', time: '17:00' },
    { id: '2', sender: 'player', content: '怎么了？', time: '17:01' },
    { id: '3', sender: 'student', content: '又超支了...', time: '17:02' },
    { id: '4', sender: 'student', content: '预算超支了老师...', time: '17:05' },
  ],
}

// 默认消息（当学生没有特定消息时使用）
const defaultMessages = [
  { id: '1', sender: 'student' as const, content: '老师好！', time: '10:00' },
  { id: '2', sender: 'player' as const, content: '你好！', time: '10:01' },
]

function ChatArea({ student }: ChatAreaProps) {
  const [message, setMessage] = useState('')

  // 根据学生 ID 获取对应的消息
  const messages = mockMessagesMap[student.studentId] || defaultMessages

  const handleSend = () => {
    if (!message.trim()) return
    console.log('发送消息:', message)
    setMessage('')
  }

  return (
    <>
      {/* 头部 - 增加渐变背景 */}
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
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.sender === 'player' ? 'justify-end' : 'justify-start'}`}
          >
            {/* 学生头像 - 仅在学生消息时显示 */}
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
              }`}
            >
              <p className="leading-relaxed">{msg.content}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === 'player' ? 'text-white/70' : 'text-gray-400'
              }`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 输入框 - 优化样式 */}
      <div className="p-4 border-t border-pink-100/50 bg-white/80">
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入消息..."
            className="flex-1 px-4 py-2.5 rounded-full border border-pink-200/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-pink-50/30 placeholder:text-gray-400 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="px-5 py-2.5 rounded-full font-medium transition-all duration-200 bg-gradient-to-r from-primary to-primary-dark text-white shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-sm"
          >
            发送
          </button>
        </div>
      </div>
    </>
  )
}
