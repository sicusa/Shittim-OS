import { useState } from 'react'
import { clubInfo, academyInfo, type Club, type Academy } from '../../data'
import { useRegisteredStudents, type RegisteredStudent } from '../../bridge/useRegisteredStudents'

export function StudentsPage() {
  const { students, loading, error, refresh } = useRegisteredStudents()
  const [filterAcademy, setFilterAcademy] = useState<Academy | 'ALL'>('ALL')
  const [filterClub, setFilterClub] = useState<Club | 'ALL'>('ALL')

  const filteredStudents = students.filter(s => {
    if (filterAcademy !== 'ALL' && s.academy !== filterAcademy) return false
    if (filterClub !== 'ALL' && s.club !== filterClub) return false
    return true
  })

  const academies = Object.keys(academyInfo) as Academy[]
  const clubs = Object.keys(clubInfo) as Club[]

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🔍</div>
          <p className="text-gray-500">正在从 Anima 获取学生数据...</p>
        </div>
      </div>
    )
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-gray-500 mb-4">获取学生数据失败: {error.message}</p>
          <button 
            onClick={refresh}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  // 空状态
  if (students.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <div className="text-center">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-500 mb-2">暂无已注册学生</p>
          <p className="text-sm text-gray-400">
            在 Anima 配置文件夹中添加 persona 配置以注册学生
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">学生</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={refresh}
            className="text-sm text-gray-500 hover:text-primary transition-colors"
            title="刷新学生列表"
          >
            🔄 刷新
          </button>
          <div className="text-sm text-gray-500">
            已注册 {filteredStudents.length} / {students.length} 名学生
          </div>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
          value={filterAcademy}
          onChange={(e) => setFilterAcademy(e.target.value as Academy | 'ALL')}
        >
          <option value="ALL">全部学院</option>
          {academies.map(a => (
            <option key={a} value={a}>{academyInfo[a].name}</option>
          ))}
        </select>
        <select 
          className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
          value={filterClub}
          onChange={(e) => setFilterClub(e.target.value as Club | 'ALL')}
        >
          <option value="ALL">全部社团</option>
          {clubs.map(c => (
            <option key={c} value={c}>{clubInfo[c].name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStudents.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  )
}

interface StudentCardProps {
  student: RegisteredStudent
}

function StudentCard({ student }: StudentCardProps) {
  const club = clubInfo[student.club]
  const academy = academyInfo[student.academy]
  
  return (
    <div className="card card-hover p-4 relative">
      {/* 会话状态指示器 */}
      {student.hasActiveSession && (
        <div className="absolute top-2 right-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block animate-pulse" title="有活跃会话" />
        </div>
      )}
      
      <div className="flex items-center gap-3">
        {/* 头像 */}
        <div 
          className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center relative"
          style={{ backgroundColor: academy.color + '20' }}
        >
          {student.avatar ? (
            <img 
              src={student.avatar} 
              alt={student.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // 加载失败时显示首字母
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <span className="text-2xl font-bold" style={{ color: academy.color }}>
              {student.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{student.name}</h3>
          <p className="text-sm text-gray-500">{club.name}</p>
        </div>
      </div>
      
      {/* 好感度 */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-500">好感度</span>
          <span className="text-primary font-medium">Lv.{student.relationship}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
            style={{ width: `${student.relationship * 10}%` }}
          />
        </div>
      </div>
      
      {/* 标签 */}
      <div className="mt-3 flex gap-2 flex-wrap">
        <span 
          className="px-2 py-0.5 rounded text-xs font-medium"
          style={{ backgroundColor: academy.color + '20', color: academy.color }}
        >
          {academy.name}
        </span>
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
          {'★'.repeat(student.rarity)}
        </span>
        {student.historySize > 0 && (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">
            {student.historySize} 条对话
          </span>
        )}
      </div>
    </div>
  )
}
