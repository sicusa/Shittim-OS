/**
 * 学生数据配置
 * 包含学生的基础信息、社团归属、好感度等
 */

import { getDefaultPortrait, hasPortrait } from './portraits'
import { getStudentNameSimple } from './names'

// 社团/部门类型
export type Club = 
  | 'GAME_DEV' // 游戏开发部
  | 'COUNTERMEASURE' // 对策委员会
  | 'PROBLEM_SOLVER_68' // 便利屋68
  | 'DISCIPLINARY' // 风纪委员会
  | 'SUPPLEMENTARY' // 补习部
  | 'GOURMET' // 美食研究会
  | 'HOT_SPRING' // 温泉开发部
  | 'RESCUE_KNIGHT' // 救护骑士团
  | 'JUSTICE' // 正义实现委员会
  | 'ENGINEERING' // 工程部
  | 'PARANORMAL' // 特异现象搜查部
  | 'SISTERHOOD' // 修女会
  | 'SUPPLY' // 补给部
  | 'SAINTS' // 圣徒会
  | 'RED_WINTER_COUNCIL' // 红冬学生会
  | 'PANDEMONIUM' // 万魔殿
  | 'SUPERNATURAL' // 超现象特务部
  | 'EMERGENCY' // 急救医学部
  | 'OTHER' // 其他

// 学院类型
export type Academy = 
  | 'ABYDOS' // 阿拜多斯
  | 'GEHENNA' // 格黑娜
  | 'TRINITY' // 圣三一
  | 'MILLENNIUM' // 千年
  | 'RED_WINTER' // 红冬
  | 'SRT' // SRT特殊学园
  | 'VALKYRIE' // 瓦尔基里警察学校
  | 'HYAKKIYAKO' // 百鬼夜行联合学院
  | 'SHANHAIJING' // 山海经
  | 'ARIUS' // 阿里乌斯

// 学生稀有度
export type Rarity = 1 | 2 | 3

// 学生数据结构
export interface Student {
  id: string
  name: string
  nameJp?: string
  nameEn?: string
  academy: Academy
  club: Club
  rarity: Rarity
  role: 'STRIKER' | 'SPECIAL'
  attackType: 'EXPLOSIVE' | 'PIERCING' | 'MYSTIC' | 'SONIC'
  avatar: string | null
  relationship: number // 好感度 1-10
  unlocked: boolean
}

// 社团信息
export const clubInfo: Record<Club, { name: string; academy: Academy; description: string }> = {
  GAME_DEV: { name: '游戏开发部', academy: 'MILLENNIUM', description: '由爱丽丝领导的游戏开发社团' },
  COUNTERMEASURE: { name: '对策委员会', academy: 'ABYDOS', description: '阿拜多斯的学生组织' },
  PROBLEM_SOLVER_68: { name: '便利屋68', academy: 'GEHENNA', description: '什么都做的便利屋' },
  DISCIPLINARY: { name: '风纪委员会', academy: 'GEHENNA', description: '格黑娜的纪律维护组织' },
  SUPPLEMENTARY: { name: '补习部', academy: 'TRINITY', description: '专注于学业辅导的社团' },
  GOURMET: { name: '美食研究会', academy: 'GEHENNA', description: '研究美食的社团' },
  HOT_SPRING: { name: '温泉开发部', academy: 'MILLENNIUM', description: '开发温泉设施的社团' },
  RESCUE_KNIGHT: { name: '救护骑士团', academy: 'TRINITY', description: '提供医疗救助的组织' },
  JUSTICE: { name: '正义实现委员会', academy: 'TRINITY', description: '维护正义的委员会' },
  ENGINEERING: { name: '工程部', academy: 'MILLENNIUM', description: '负责技术工程的部门' },
  PARANORMAL: { name: '特异现象搜查部', academy: 'MILLENNIUM', description: '调查超自然现象的部门' },
  SISTERHOOD: { name: '修女会', academy: 'TRINITY', description: '圣三一的修女组织' },
  SUPPLY: { name: '补给部', academy: 'TRINITY', description: '负责后勤补给的部门' },
  SAINTS: { name: '圣徒会', academy: 'TRINITY', description: '圣三一的最高学生会' },
  RED_WINTER_COUNCIL: { name: '红冬学生会', academy: 'RED_WINTER', description: '红冬的学生会' },
  PANDEMONIUM: { name: '万魔殿', academy: 'GEHENNA', description: '格黑娜的神秘组织' },
  SUPERNATURAL: { name: '超现象特务部', academy: 'MILLENNIUM', description: '超现象调查特务部门' },
  EMERGENCY: { name: '急救医学部', academy: 'TRINITY', description: '急救医疗部门' },
  OTHER: { name: '其他', academy: 'MILLENNIUM', description: '未归属特定社团' },
}

// 学院信息
export const academyInfo: Record<Academy, { name: string; color: string }> = {
  ABYDOS: { name: '阿拜多斯', color: '#5DADE2' },
  GEHENNA: { name: '格黑娜', color: '#E74C3C' },
  TRINITY: { name: '圣三一', color: '#F1C40F' },
  MILLENNIUM: { name: '千年', color: '#3498DB' },
  RED_WINTER: { name: '红冬', color: '#C0392B' },
  SRT: { name: 'SRT特殊学园', color: '#9B59B6' },
  VALKYRIE: { name: '瓦尔基里', color: '#1ABC9C' },
  HYAKKIYAKO: { name: '百鬼夜行', color: '#E67E22' },
  SHANHAIJING: { name: '山海经', color: '#27AE60' },
  ARIUS: { name: '阿里乌斯', color: '#34495E' },
}

/**
 * 创建学生对象的工厂函数
 */
function createStudent(
  id: string,
  academy: Academy,
  club: Club,
  rarity: Rarity = 3,
  role: Student['role'] = 'STRIKER',
  attackType: Student['attackType'] = 'EXPLOSIVE',
  relationship: number = 1,
  unlocked: boolean = true
): Student {
  return {
    id,
    name: getStudentNameSimple(id, 'zh'),
    nameJp: undefined,
    nameEn: getStudentNameSimple(id, 'en'),
    academy,
    club,
    rarity,
    role,
    attackType,
    avatar: hasPortrait(id) ? getDefaultPortrait(id) : null,
    relationship,
    unlocked,
  }
}

// 所有学生数据
export const students: Student[] = [
  // === 游戏开发部 ===
  createStudent('ARIS', 'MILLENNIUM', 'GAME_DEV', 3, 'STRIKER', 'MYSTIC', 7, true),
  createStudent('MOMOI', 'MILLENNIUM', 'GAME_DEV', 3, 'STRIKER', 'PIERCING', 5, true),
  createStudent('MIDORI', 'MILLENNIUM', 'GAME_DEV', 3, 'SPECIAL', 'PIERCING', 5, true),
  createStudent('YUZU', 'MILLENNIUM', 'GAME_DEV', 2, 'STRIKER', 'PIERCING', 4, true),
  
  // === 对策委员会 ===
  createStudent('HOSHINO', 'ABYDOS', 'COUNTERMEASURE', 3, 'STRIKER', 'EXPLOSIVE', 6, true),
  createStudent('SHIROKO', 'ABYDOS', 'COUNTERMEASURE', 3, 'STRIKER', 'EXPLOSIVE', 6, true),
  createStudent('NONOMI', 'ABYDOS', 'COUNTERMEASURE', 2, 'STRIKER', 'EXPLOSIVE', 4, true),
  createStudent('SERIKA', 'ABYDOS', 'COUNTERMEASURE', 2, 'STRIKER', 'EXPLOSIVE', 4, true),
  createStudent('AYANE', 'ABYDOS', 'COUNTERMEASURE', 2, 'SPECIAL', 'EXPLOSIVE', 3, true),
  
  // === 便利屋68 ===
  createStudent('ARU', 'GEHENNA', 'PROBLEM_SOLVER_68', 3, 'STRIKER', 'EXPLOSIVE', 5, true),
  createStudent('MUTSUKI', 'GEHENNA', 'PROBLEM_SOLVER_68', 3, 'STRIKER', 'EXPLOSIVE', 4, true),
  createStudent('HARUKA', 'GEHENNA', 'PROBLEM_SOLVER_68', 3, 'SPECIAL', 'EXPLOSIVE', 3, true),
  createStudent('KAYUKO', 'GEHENNA', 'PROBLEM_SOLVER_68', 3, 'STRIKER', 'PIERCING', 3, true),
  
  // === 风纪委员会 ===
  createStudent('HINA', 'GEHENNA', 'DISCIPLINARY', 3, 'STRIKER', 'EXPLOSIVE', 7, true),
  createStudent('AKO', 'GEHENNA', 'DISCIPLINARY', 3, 'SPECIAL', 'MYSTIC', 5, true),
  createStudent('IORI', 'GEHENNA', 'DISCIPLINARY', 3, 'STRIKER', 'PIERCING', 4, true),
  createStudent('CHIAKI', 'GEHENNA', 'DISCIPLINARY', 2, 'STRIKER', 'EXPLOSIVE', 2, true),
  
  // === 补习部 ===
  createStudent('HIFUMI', 'TRINITY', 'SUPPLEMENTARY', 3, 'STRIKER', 'MYSTIC', 6, true),
  createStudent('HANAKO', 'TRINITY', 'SUPPLEMENTARY', 3, 'SPECIAL', 'MYSTIC', 5, true),
  createStudent('KOHARU', 'TRINITY', 'SUPPLEMENTARY', 3, 'SPECIAL', 'MYSTIC', 4, true),
  createStudent('AZUSA', 'TRINITY', 'SUPPLEMENTARY', 3, 'STRIKER', 'PIERCING', 5, true),
  
  // === 美食研究会 ===
  createStudent('HARUNA', 'GEHENNA', 'GOURMET', 3, 'STRIKER', 'MYSTIC', 5, true),
  createStudent('JUNKO', 'GEHENNA', 'GOURMET', 2, 'STRIKER', 'EXPLOSIVE', 3, true),
  createStudent('FUUKA', 'GEHENNA', 'GOURMET', 2, 'SPECIAL', 'EXPLOSIVE', 4, true),
  
  // === 其他重要学生 ===
  createStudent('HIMARI', 'MILLENNIUM', 'SUPERNATURAL', 3, 'SPECIAL', 'MYSTIC', 6, true),
  createStudent('YUUKA', 'MILLENNIUM', 'OTHER', 3, 'STRIKER', 'EXPLOSIVE', 7, true),
  createStudent('ASUNA', 'MILLENNIUM', 'OTHER', 3, 'STRIKER', 'PIERCING', 5, true),
  createStudent('NERU', 'MILLENNIUM', 'OTHER', 3, 'STRIKER', 'PIERCING', 4, true),
  createStudent('NAGISA', 'TRINITY', 'SAINTS', 3, 'SPECIAL', 'MYSTIC', 5, true),
  createStudent('MIKA', 'TRINITY', 'SAINTS', 3, 'STRIKER', 'MYSTIC', 6, true),
  createStudent('WAKAMO', 'HYAKKIYAKO', 'OTHER', 3, 'STRIKER', 'EXPLOSIVE', 5, true),
  createStudent('TOKI', 'MILLENNIUM', 'OTHER', 3, 'STRIKER', 'PIERCING', 4, true),
  
  // === 特殊角色 ===
  createStudent('ARONA', 'MILLENNIUM', 'OTHER', 3, 'SPECIAL', 'MYSTIC', 10, true),
  createStudent('PLANA', 'MILLENNIUM', 'OTHER', 3, 'SPECIAL', 'MYSTIC', 3, false),
]

/**
 * 根据 ID 获取学生
 */
export function getStudentById(id: string): Student | undefined {
  return students.find(s => s.id.toUpperCase() === id.toUpperCase())
}

/**
 * 根据社团筛选学生
 */
export function getStudentsByClub(club: Club): Student[] {
  return students.filter(s => s.club === club)
}

/**
 * 根据学院筛选学生
 */
export function getStudentsByAcademy(academy: Academy): Student[] {
  return students.filter(s => s.academy === academy)
}

/**
 * 获取已解锁的学生
 */
export function getUnlockedStudents(): Student[] {
  return students.filter(s => s.unlocked)
}

/**
 * 获取按好感度排序的学生
 */
export function getStudentsByRelationship(): Student[] {
  return [...students].sort((a, b) => b.relationship - a.relationship)
}
