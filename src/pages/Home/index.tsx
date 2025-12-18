import { usePlayer } from '@/bridge/hooks'

export function HomePage() {
  const { player, loading } = usePlayer()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 欢迎卡片 */}
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          欢迎回来，老师！
        </h1>
        <p className="text-gray-500">
          {loading ? '正在获取信息...' : `当前玩家: ${player?.name ?? '未知'}`}
        </p>
      </div>

      {/* 快捷入口 */}
      <div className="grid grid-cols-2 gap-4">
        <QuickCard
          title="MomoTalk"
          description="与学生们聊天"
          icon="💬"
          href="/momotalk"
          color="bg-pink-50 border-pink-200"
        />
        <QuickCard
          title="学生"
          description="查看学生信息"
          icon="👥"
          href="/students"
          color="bg-blue-50 border-blue-200"
        />
        <QuickCard
          title="委托任务"
          description="日常与周常任务"
          icon="📋"
          href="/tasks"
          color="bg-yellow-50 border-yellow-200"
        />
        <QuickCard
          title="设置"
          description="系统设置"
          icon="⚙️"
          href="/settings"
          color="bg-gray-50 border-gray-200"
        />
      </div>

      {/* 玩家状态 */}
      {player && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">玩家状态</h2>
          <div className="grid grid-cols-3 gap-4">
            <StatusItem label="生命值" value={`${player.health}/${player.maxHealth}`} icon="❤️" />
            <StatusItem label="饱食度" value={`${player.hunger}/20`} icon="🍖" />
            <StatusItem label="等级" value={`Lv.${player.level}`} icon="⭐" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              📍 位置: {Math.floor(player.position.x)}, {Math.floor(player.position.y)}, {Math.floor(player.position.z)}
            </p>
            <p className="text-sm text-gray-500">
              🌍 维度: {player.dimension.replace('minecraft:', '')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

interface QuickCardProps {
  title: string
  description: string
  icon: string
  href: string
  color: string
}

function QuickCard({ title, description, icon, href, color }: QuickCardProps) {
  return (
    <a
      href={href}
      className={`card card-hover p-4 ${color} transition-all duration-200`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </a>
  )
}

interface StatusItemProps {
  label: string
  value: string
  icon: string
}

function StatusItem({ label, value, icon }: StatusItemProps) {
  return (
    <div className="text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-semibold text-gray-800">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}
