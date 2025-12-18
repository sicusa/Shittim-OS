/**
 * BA学生名称映射表
 * 数据来源: https://kivo.wiki/article/39
 */

export const studentNameMap: Record<string, { zh: string; en: string }> = {
  // === 千禧科学学院 - 游戏开发部 ===
  ARIS: { zh: '爱丽丝', en: 'Aris' },        // 天童 爱丽丝
  MOMOI: { zh: '桃井', en: 'Momoi' },        // 才羽 桃井
  MIDORI: { zh: '绿', en: 'Midori' },        // 才羽 绿
  YUZU: { zh: '柚子', en: 'Yuzu' },          // 花冈 柚子
  
  // === 阿比多斯高中 - 对策委员会 ===
  HOSHINO: { zh: '星野', en: 'Hoshino' },    // 小鸟游 星野
  SHIROKO: { zh: '白子', en: 'Shiroko' },    // 砂狼 白子
  NONOMI: { zh: '野宫', en: 'Nonomi' },      // 十六夜 野宫
  SERIKA: { zh: '芹香', en: 'Serika' },      // 黑见 芹香
  AYANE: { zh: '绫音', en: 'Ayane' },        // 奥空 绫音
  
  // === 格赫娜学园 - 便利屋68 ===
  ARU: { zh: '阿露', en: 'Aru' },            // 陆八魔 阿露
  MUTSUKI: { zh: '睦月', en: 'Mutsuki' },    // 浅黄 睦月
  HARUKA: { zh: '遥香', en: 'Haruka' },      // 伊草 遥香
  KAYUKO: { zh: '佳代子', en: 'Kayoko' },    // 鬼方 佳代子
  
  // === 格赫娜学园 - 风纪委员会 ===
  HINA: { zh: '日奈', en: 'Hina' },          // 空崎 日奈
  AKO: { zh: '亚子', en: 'Ako' },            // 天雨 亚子
  IORI: { zh: '伊织', en: 'Iori' },          // 银镜 伊织
  CHIAKI: { zh: '千明', en: 'Chiaki' },      // 元宫 千明
  
  // === 圣三一综合学园 - 补习部 ===
  HIFUMI: { zh: '日富美', en: 'Hifumi' },    // 阿慈谷 日富美
  HANAKO: { zh: '花子', en: 'Hanako' },      // 浦和 花子
  KOHARU: { zh: '小春', en: 'Koharu' },      // 下江 小春
  AZUSA: { zh: '梓', en: 'Azusa' },          // 白洲 梓
  
  // === 格赫娜学园 - 美食研究会 ===
  HARUNA: { zh: '晴奈', en: 'Haruna' },      // 黑馆 晴奈
  JUNKO: { zh: '纯子', en: 'Junko' },        // 赤司 纯子
  FUUKA: { zh: '枫香', en: 'Fuuka' },        // 爱清 枫香
  
  // === 千禧科学学院 ===
  ASUNA: { zh: '明日奈', en: 'Asuna' },      // 一之濑 明日奈
  NERU: { zh: '妮禄', en: 'Neru' },          // 美甘 妮禄
  YUUKA: { zh: '优香', en: 'Yuuka' },        // 早濑 优香
  HIMARI: { zh: '日鞠', en: 'Himari' },      // 明星 日鞠
  TOKI: { zh: '时', en: 'Toki' },            // 飞鸟马 时
  
  // === 圣三一综合学园 - 圣徒会 ===
  MIKA: { zh: '未花', en: 'Mika' },          // 圣园 未花
  NAGISA: { zh: '渚', en: 'Nagisa' },        // 桐藤 渚
  
  // === 百鬼夜行联合学园 ===
  WAKAMO: { zh: '若藻', en: 'Wakamo' },      // 狐坂 若藻
  
  // === 夏莱 - 特殊角色 ===
  ARONA: { zh: '阿罗娜', en: 'Arona' },
  PLANA: { zh: '普拉娜', en: 'Plana' },
  SENSEI: { zh: '老师', en: 'Sensei' },
}

export function getStudentNameSimple(id: string, lang: 'zh' | 'en' = 'zh'): string {
  const names = studentNameMap[id.toUpperCase()]
  if (!names) return id
  return names[lang] ?? names.zh ?? id
}
