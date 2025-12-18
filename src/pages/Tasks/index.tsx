export function TasksPage() {
  // 临时 mock 数据
  const dailyTasks = [
    { id: '1', title: '采集小麦', progress: 5, maxProgress: 10, reward: '100 经验' },
    { id: '2', title: '击杀僵尸', progress: 3, maxProgress: 5, reward: '50 金币' },
    { id: '3', title: '与学生交流', progress: 1, maxProgress: 3, reward: '好感度 +5' },
  ]

  const weeklyTasks = [
    { id: '4', title: '完成副本挑战', progress: 1, maxProgress: 3, reward: '稀有道具' },
    { id: '5', title: '探索新区域', progress: 0, maxProgress: 5, reward: '200 经验' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800">委托任务</h1>

      {/* 日常任务 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>📅</span> 日常任务
        </h2>
        <div className="space-y-3">
          {dailyTasks.map((task) => (
            <TaskCard key={task.id} {...task} />
          ))}
        </div>
      </section>

      {/* 周常任务 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>📆</span> 周常任务
        </h2>
        <div className="space-y-3">
          {weeklyTasks.map((task) => (
            <TaskCard key={task.id} {...task} />
          ))}
        </div>
      </section>
    </div>
  )
}

interface TaskCardProps {
  id: string
  title: string
  progress: number
  maxProgress: number
  reward: string
}

function TaskCard({ title, progress, maxProgress, reward }: TaskCardProps) {
  const isCompleted = progress >= maxProgress
  const percentage = Math.round((progress / maxProgress) * 100)

  return (
    <div className={`card p-4 ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <span className={`text-sm ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
          {progress}/{maxProgress}
        </span>
      </div>

      {/* 进度条 */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isCompleted ? 'bg-green-500' : 'bg-primary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          🎁 奖励: {reward}
        </span>
        {isCompleted ? (
          <button className="btn btn-primary text-sm py-1">
            领取奖励
          </button>
        ) : (
          <span className="text-sm text-gray-400">进行中...</span>
        )}
      </div>
    </div>
  )
}
