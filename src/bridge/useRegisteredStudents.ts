/**
 * 已注册学生管理 Hook
 * 
 * 从 Anima 后端获取已注册学生列表，并与本地学生元数据合并。
 * 只有在后端配置了 persona 的学生才会被视为"已注册"并显示在 UI 中。
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { bridge } from './client'
import type { AnimaStudent, AnimaGetStudentsResponse } from './types'
import { students as allStudents, type Student, getDefaultPortrait } from '../data'

/**
 * 已注册学生信息（合并后端状态与本地元数据）
 */
export interface RegisteredStudent extends Student {
  /** 是否有活跃会话 */
  hasActiveSession: boolean
  /** 历史消息数量 */
  historySize: number
  /** 后端返回的原始数据 */
  animaData: AnimaStudent
}

/**
 * 学生ID到本地元数据的映射
 * 用于将后端返回的 studentId 匹配到本地学生数据
 */
const studentIdMap: Record<string, string> = {
  // 后端 ID (小写) -> 前端 ID
  'arona': 'ARONA',
  'aris': 'ARIS',
  'alice': 'ARIS', // 别名支持
  'shiroko': 'SHIROKO',
  'hoshino': 'HOSHINO',
  'nonomi': 'NONOMI',
  'serika': 'SERIKA',
  'ayane': 'AYANE',
  'momoi': 'MOMOI',
  'midori': 'MIDORI',
  'yuzu': 'YUZU',
  'aru': 'ARU',
  // ... 可根据需要添加更多映射
}

/**
 * 根据后端 ID 获取本地学生数据
 */
function findLocalStudent(animaStudent: AnimaStudent): Student | null {
  const id = animaStudent.id.toLowerCase()
  
  // 1. 尝试使用映射表
  const mappedId = studentIdMap[id]
  if (mappedId) {
    const student = allStudents.find(s => s.id === mappedId)
    if (student) return student
  }
  
  // 2. 尝试直接匹配 ID（不区分大小写）
  const directMatch = allStudents.find(
    s => s.id.toLowerCase() === id
  )
  if (directMatch) return directMatch
  
  // 3. 尝试匹配名称
  const nameMatch = allStudents.find(
    s => s.name === animaStudent.name || s.name.toLowerCase() === animaStudent.name?.toLowerCase()
  )
  if (nameMatch) return nameMatch
  
  // 4. 没有找到本地数据，创建一个占位学生
  console.warn(`[useRegisteredStudents] 未找到本地学生数据: ${animaStudent.id} (${animaStudent.name})`)
  return null
}

/**
 * 创建占位学生数据（当本地没有对应数据时）
 */
function createPlaceholderStudent(animaStudent: AnimaStudent): Student {
  return {
    id: animaStudent.id.toUpperCase(),
    name: animaStudent.name || animaStudent.id,
    avatar: getDefaultPortrait(animaStudent.id) || null,
    academy: 'SRT', // 默认学院
    club: 'OTHER', // 默认社团
    rarity: 1,
    role: 'SPECIAL',
    attackType: 'MYSTIC',
    relationship: 1,
    unlocked: true,
  }
}

/**
 * 已注册学生管理 Hook
 * 
 * @param refreshInterval 自动刷新间隔（毫秒），设为 0 禁用自动刷新
 * @returns 已注册学生列表和管理函数
 */
export function useRegisteredStudents(refreshInterval: number = 0) {
  const [registeredStudents, setRegisteredStudents] = useState<RegisteredStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  /**
   * 从后端获取已注册学生列表
   */
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('[useRegisteredStudents] 正在获取已注册学生列表...')
      const response = await bridge.animaGetStudents() as AnimaGetStudentsResponse
      
      if (!response.success) {
        throw new Error(response.error || '获取学生列表失败')
      }
      
      console.log('[useRegisteredStudents] 后端返回学生:', response.students)
      
      // 合并后端数据与本地元数据
      const merged: RegisteredStudent[] = response.students.map(animaStudent => {
        const localStudent = findLocalStudent(animaStudent) || createPlaceholderStudent(animaStudent)
        
        return {
          ...localStudent,
          // 后端状态
          hasActiveSession: animaStudent.hasActiveSession,
          historySize: animaStudent.historySize || 0,
          animaData: animaStudent,
          // 确保已注册学生显示为解锁状态
          unlocked: true,
        }
      })
      
      setRegisteredStudents(merged)
      setLastFetched(new Date())
      console.log('[useRegisteredStudents] 已注册学生:', merged.map(s => s.name))
      
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      console.error('[useRegisteredStudents] 获取失败:', err)
      setError(err)
      
      // 获取失败时，回退到默认学生（阿罗娜）
      const fallbackStudent = allStudents.find(s => s.id === 'ARONA')
      if (fallbackStudent) {
        setRegisteredStudents([{
          ...fallbackStudent,
          hasActiveSession: false,
          historySize: 0,
          animaData: { id: 'arona', name: '阿罗娜', hasActiveSession: false },
          unlocked: true,
        }])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // 初始加载
  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  // 自动刷新
  useEffect(() => {
    if (refreshInterval <= 0) return
    
    const timer = setInterval(fetchStudents, refreshInterval)
    return () => clearInterval(timer)
  }, [refreshInterval, fetchStudents])

  /**
   * 检查学生是否已注册
   */
  const isRegistered = useCallback((studentId: string): boolean => {
    const normalizedId = studentId.toLowerCase()
    return registeredStudents.some(
      s => s.id.toLowerCase() === normalizedId || 
           s.animaData.id.toLowerCase() === normalizedId
    )
  }, [registeredStudents])

  /**
   * 获取已注册学生（通过 ID）
   */
  const getStudent = useCallback((studentId: string): RegisteredStudent | null => {
    const normalizedId = studentId.toLowerCase()
    return registeredStudents.find(
      s => s.id.toLowerCase() === normalizedId || 
           s.animaData.id.toLowerCase() === normalizedId
    ) || null
  }, [registeredStudents])

  /**
   * 已注册学生的 ID 集合（用于快速查找）
   */
  const registeredIds = useMemo(() => {
    const ids = new Set<string>()
    registeredStudents.forEach(s => {
      ids.add(s.id.toLowerCase())
      ids.add(s.animaData.id.toLowerCase())
    })
    return ids
  }, [registeredStudents])

  return {
    /** 已注册学生列表 */
    students: registeredStudents,
    /** 是否正在加载 */
    loading,
    /** 错误信息 */
    error,
    /** 最后获取时间 */
    lastFetched,
    /** 刷新学生列表 */
    refresh: fetchStudents,
    /** 检查学生是否已注册 */
    isRegistered,
    /** 获取已注册学生 */
    getStudent,
    /** 已注册 ID 集合 */
    registeredIds,
  }
}

/**
 * 获取对话列表中应显示的学生
 * 这是一个更简单的版本，专门用于 MomoTalk 对话列表
 */
export function useConversationStudents() {
  const { students, loading, error, refresh } = useRegisteredStudents()
  
  // 转换为对话列表需要的格式
  const conversationStudents = useMemo(() => {
    return students.map(student => ({
      studentId: student.animaData.id, // 使用后端 ID
      name: student.name,
      avatar: student.avatar || getDefaultPortrait(student.id),
      hasHistory: student.historySize > 0,
    }))
  }, [students])
  
  return {
    students: conversationStudents,
    loading,
    error,
    refresh,
  }
}
