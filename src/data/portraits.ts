/**
 * 学生头像资源配置
 * 
 * 从头像文件名自动解析学生 ID 和差分
 * 默认头像为无数字后缀或数字最小的版本
 */

// 头像路径前缀
export const PORTRAIT_BASE_PATH = '/portraits'

// 获取头像完整路径
export function getPortraitPath(filename: string): string {
  return `${PORTRAIT_BASE_PATH}/${filename}`
}

// 学生头像映射表：学生ID -> 所有差分头像
export const studentPortraits: Record<string, string[]> = {
  // === 游戏开发部 ===
  ARIS: ['ba_portrait_ARIS.png', 'ba_portrait_ARIS2.png', 'ba_portrait_ARIS3.png'],
  MOMOI: ['ba_portrait_MOMOI.png', 'ba_portrait_MOMOI2.png', 'ba_portrait_MOMOI3.png'],
  MIDORI: ['ba_portrait_MIDORI.png', 'ba_portrait_MIDORI2.png', 'ba_portrait_MIDORI3.png'],
  YUZU: ['ba_portrait_YUZU.png', 'ba_portrait_YUZU2.png', 'ba_portrait_YUZU3.png'],
  
  // === 对策委员会 ===
  HOSHINO: ['ba_portrait_HOSHINO.png', 'ba_portrait_HOSHINO2.png', 'ba_portrait_HOSHINO3.png', 'ba_portrait_HOSHINO4.png', 'ba_portrait_HOSHINO5.png', 'ba_portrait_HOSHINO6.png', 'ba_portrait_HOSHINO7.png', 'ba_portrait_HOSHINO8.png'],
  SHIROKO: ['ba_portrait_SHIROKO.png', 'ba_portrait_SHIROKO2.png', 'ba_portrait_SHIROKO3.png', 'ba_portrait_SHIROKO4.png'],
  NONOMI: ['ba_portrait_NONOMI.png', 'ba_portrait_NONOMI2.png', 'ba_portrait_NONOMI3.png', 'ba_portrait_NONOMI4.png'],
  SERIKA: ['ba_portrait_SERIKA.png', 'ba_portrait_SERIKA2.png', 'ba_portrait_SERIKA3.png', 'ba_portrait_SERIKA4.png', 'ba_portrait_SERIKA5.png', 'ba_portrait_SERIKA6.png', 'ba_portrait_SERIKA7.png'],
  AYANE: ['ba_portrait_AYANE.png', 'ba_portrait_AYANE2.png', 'ba_portrait_AYANE3.png', 'ba_portrait_AYANE4.png'],
  
  // === 便利屋68 ===
  ARU: ['ba_portrait_ARU.png', 'ba_portrait_ARU2.png', 'ba_portrait_ARU3.png', 'ba_portrait_ARU4.png', 'ba_portrait_ARU5.png'],
  MUTSUKI: ['ba_portrait_MUTSUKI.png', 'ba_portrait_MUTSUKI2.png', 'ba_portrait_MUTSUKI3.png', 'ba_portrait_MUTSUKI4.png', 'ba_portrait_MUTSUKI5.png'],
  HARUKA: ['ba_portrait_HARUKA.png', 'ba_portrait_HARUKA2.png', 'ba_portrait_HARUKA3.png', 'ba_portrait_HARUKA4.png'],
  KAYUKO: ['ba_portrait_KAYUKO.png', 'ba_portrait_KAYUKO2.png', 'ba_portrait_KAYUKO3.png', 'ba_portrait_KAYUKO4.png'],
  
  // === 温泉开发部 ===
  CHINATSU: ['ba_portrait_CHINATSU.png', 'ba_portrait_CHINATSU2.png'],
  NODOKA: ['ba_portrait_NODOKA.png'],
  
  // === 补习部 ===
  HIFUMI: ['ba_portrait_HIFUMI.png', 'ba_portrait_HIFUMI2.png'],
  HANAKO: ['ba_portrait_HANAKO.png', 'ba_portrait_HANAKO2.png', 'ba_portrait_HANAKO3.png'],
  KOHARU: ['ba_portrait_KOHARU.png', 'ba_portrait_KOHARU2.png'],
  AZUSA: ['ba_portrait_AZUSA.png', 'ba_portrait_AZUSA2.png', 'ba_portrait_AZUSA3.png', 'ba_portrait_AZUSA4.png'],
  
  // === 风纪委员会 ===
  HINA: ['ba_portrait_HINA.png', 'ba_portrait_HINA2.png', 'ba_portrait_HINA3.png', 'ba_portrait_HINA4.png'],
  AKO: ['ba_portrait_AKO.png', 'ba_portrait_AKO2.png', 'ba_portrait_AKO3.png', 'ba_portrait_AKO4.png'],
  IORI: ['ba_portrait_IORI.png', 'ba_portrait_IORI2.png'],
  CHIAKI: ['ba_portrait_CHIAKI.png'],
  
  // === 美食研究会 ===
  HARUNA: ['ba_portrait_HARUNA.png', 'ba_portrait_HARUNA2.png', 'ba_portrait_HARUNA3.png'],
  JUNKO: ['ba_portrait_JUNKO.png', 'ba_portrait_JUNKO2.png'],
  FUUKA: ['ba_portrait_HUUKA.png', 'ba_portrait_HUUKA2.png', 'ba_portrait_HUUKA3.png', 'ba_portrait_HUUKA4.png', 'ba_portrait_HUUKA5.png', 'ba_portrait_HUUKA6.png'],
  
  // === 救护骑士团 ===
  SERINA: ['ba_portrait_SERINA.png', 'ba_portrait_SERINA2.png', 'ba_portrait_SERINA3.png'],
  HANAE: ['ba_portrait_HANAE.png', 'ba_portrait_HANAE2.png', 'ba_portrait_HANAE3.png'],
  AYUMI: ['ba_portrait_AYUME.png'],
  KOTORI: ['ba_portrait_KOTORI.png', 'ba_portrait_KOTORI2.png'],
  
  // === 正义实现委员会 ===
  HASUMI: ['ba_portrait_HASUMI.png', 'ba_portrait_HASUMI2.png', 'ba_portrait_HASUMI3.png'],
  TSURUGI: ['ba_portrait_TSURUGI.png', 'ba_portrait_TSURUGI2.png', 'ba_portrait_TSURUGI3.png'],
  CHISE: ['ba_portrait_CHISE.png', 'ba_portrait_CHISE2.png'],
  
  // === 工程部 ===
  HIBIKI: ['ba_portrait_HIBIKI.png', 'ba_portrait_HIBIKI2.png'],
  UTAHA: ['ba_portrait_UTAHA.png', 'ba_portrait_UTAHA2.png', 'ba_portrait_UTAHA3.png'],
  KOTAMA: ['ba_portrait_KOTAMA.png', 'ba_portrait_KOTAMA2.png', 'ba_portrait_KOTAMA3.png', 'ba_portrait_KOTAMA4.png'],
  
  // === 特异现象搜查部 ===
  NATSUME: ['ba_portrait_NATSU.png', 'ba_portrait_NATSU2.png', 'ba_portrait_NATSU3.png'],
  SUMIRE: ['ba_portrait_SUMIRE.png', 'ba_portrait_SUMIRE2.png'],
  SHIZUKO: ['ba_portrait_SHIZUKO.png', 'ba_portrait_SHIZUKO2.png'],
  
  // === 修女会 ===
  MARI: ['ba_portrait_MARI.png', 'ba_portrait_MARI2.png', 'ba_portrait_MARI3.png'],
  HINATA: ['ba_portrait_HINATA.png', 'ba_portrait_HINATA2.png'],
  
  // === 补给部 ===
  AKARI: ['ba_portrait_AKARI.png', 'ba_portrait_AKARI2.png'],
  
  // === 圣徒会 ===
  NAGISA: ['ba_portrait_NAGISA.png', 'ba_portrait_NAGISA2.png'],
  MIKA: ['ba_portrait_MIKA.png', 'ba_portrait_MIKA2.png', 'ba_portrait_MIKA3.png', 'ba_portrait_MIKA4.png'],
  SEIA: ['ba_portrait_SEIYA.png', 'ba_portrait_SEIYA2.png'],
  
  // === 红冬学生会 ===
  CHERINO: ['ba_portrait_CHERINO.png', 'ba_portrait_CHERINO2.png', 'ba_portrait_CHERINO3.png'],
  NODOKA_CHERINO: ['ba_portrait_NODOKA.png'],
  
  // === 万魔殿 ===
  SAORI: ['ba_portrait_SAORI.png', 'ba_portrait_SAORI2.png', 'ba_portrait_SAORI3.png', 'ba_portrait_SAORI4.png', 'ba_portrait_SAORI5.png'],
  MIYAKO: ['ba_portrait_MIYAKO.png', 'ba_portrait_MIYAKO2.png', 'ba_portrait_MIYAKO3.png'],
  HIYORI: ['ba_portrait_HIYURI.png', 'ba_portrait_HIYURI2.png'],
  
  // === 超现象特务部 ===
  HIMARI: ['ba_portrait_HIMARI.png', 'ba_portrait_HIMARI1.png', 'ba_portrait_HIMARI2.png', 'ba_portrait_HIMARI3.png', 'ba_portrait_HIMARI4.png'],
  EIMI: ['ba_portrait_EIMI.png', 'ba_portrait_EIMI2.png'],
  
  // === 急救医学部 ===
  KARIN: ['ba_portrait_KARIN.png', 'ba_portrait_KARIN2.png', 'ba_portrait_KARIN3.png'],
  
  // === 其他重要学生 ===
  ASUNA: ['ba_portrait_ASUNA.png', 'ba_portrait_ASUNA2.png', 'ba_portrait_ASUNA3.png'],
  NERU: ['ba_portrait_NERU.png', 'ba_portrait_NERU2.png', 'ba_portrait_NERU3.png'],
  KANNA: ['ba_portrait_KANNA.png', 'ba_portrait_KANNA2.png'],
  SHUN: ['ba_portrait_SHUN.png', 'ba_portrait_SHUN2.png'],
  KASUMI: ['ba_portrait_KASUMI.png', 'ba_portrait_KASUMI2.png'],
  IZUNA: ['ba_portrait_IZUNA.png', 'ba_portrait_IZUNA2.png'],
  TSUBAKI: ['ba_portrait_TSUBAKI.png', 'ba_portrait_TSUBAKI2.png'],
  TOKI: ['ba_portrait_TOKI.png', 'ba_portrait_TOKI2.png', 'ba_portrait_TOKI3.png'],
  WAKAMO: ['ba_portrait_WAKAMO.png'],
  YUUKA: ['ba_portrait_YUUKA.png', 'ba_portrait_YUUKA2.png', 'ba_portrait_YUUKA3.png', 'ba_portrait_YUUKA4.png'],
  NOA: ['ba_portrait_NOA.png', 'ba_portrait_NOA2.png'],
  KAZUSA: ['ba_portrait_KAZUSA.png', 'ba_portrait_KAZUSA2.png', 'ba_portrait_KAZUSA3.png'],
  MASHIRO: ['ba_portrait_MASHIRO.png', 'ba_portrait_MASHIRO2.png'],
  SAKI: ['ba_portrait_SAKI.png', 'ba_portrait_SAKI2.png', 'ba_portrait_SAKI3.png'],
  AKANE: ['ba_portrait_AKANE.png', 'ba_portrait_AKANE2.png', 'ba_portrait_AKANE3.png'],
  FUBUKI: ['ba_portrait_FUBUKI.png', 'ba_portrait_FUBUKI2.png', 'ba_portrait_FUBUKI3.png'],
  ATSUKO: ['ba_portrait_ATSUKO.png', 'ba_portrait_ATSUKO2.png'],
  
  // === 特殊角色 ===
  ARONA: ['ba_portrait_OS_ARONA.png'],
  PLANA: ['ba_portrait_OS_PLANA.png'],
  SENSEI: ['ba_portrait_ZPLAYER.png'],
}

/**
 * 获取学生的默认头像（第一个）
 */
export function getDefaultPortrait(studentId: string): string | null {
  const portraits = studentPortraits[studentId.toUpperCase()]
  if (!portraits || portraits.length === 0) return null
  return getPortraitPath(portraits[0])
}

/**
 * 获取学生的所有头像
 */
export function getAllPortraits(studentId: string): string[] {
  const portraits = studentPortraits[studentId.toUpperCase()]
  if (!portraits) return []
  return portraits.map(getPortraitPath)
}

/**
 * 检查学生是否有头像
 */
export function hasPortrait(studentId: string): boolean {
  return studentId.toUpperCase() in studentPortraits
}

// 从 names.ts 导入学生名称
import { studentNameMap, getStudentNameSimple } from './names'

// 重导出名称相关
export { studentNameMap as studentNames, getStudentNameSimple as getStudentName }
