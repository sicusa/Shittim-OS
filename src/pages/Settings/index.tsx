import { useState, useEffect } from 'react'

// 缩放值存储到 localStorage
const ZOOM_KEY = 'shittim-browser-zoom'
const applyZoom = (zoom: number) => {
  const scale = zoom / 100
  document.documentElement.style.setProperty('--browser-zoom', String(scale))
  document.body.style.transform = `scale(${scale})`
  document.body.style.transformOrigin = 'top left'
  document.body.style.width = `${100 / scale}%`
  document.body.style.height = `${100 / scale}%`
  localStorage.setItem(ZOOM_KEY, String(zoom))
};
const getAndApplyInitialZoom = () => {
  const stored = localStorage.getItem(ZOOM_KEY)
  const zoom = stored ? Number(stored) : 100
  applyZoom(zoom)
  return zoom
}

export function SettingsPage() {
  const [volume, setVolume] = useState(80)
  const [notifications, setNotifications] = useState(true)
  const [debugMode, setDebugMode] = useState(false)
  const [browserZoom, setBrowserZoom] = useState(getAndApplyInitialZoom)

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800">设置</h1>

      {/* 显示设置 */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">🖥️ 显示</h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-700">浏览器缩放</label>
              <span className="text-sm text-gray-500">{browserZoom}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="250"
              step="5"
              value={browserZoom}
              onPointerUp={() => applyZoom(browserZoom)}
              onChange={(e) => setBrowserZoom(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>50%</span>
              <span>100%</span>
              <span>150%</span>
              <span>200%</span>
              <span>250%</span>
            </div>
          </div>
        </div>
      </section>

      {/* 音频设置 */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">🔊 音频</h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-700">主音量</label>
              <span className="text-sm text-gray-500">{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      </section>

      {/* 通知设置 */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">🔔 通知</h2>
        
        <div className="space-y-4">
          <ToggleItem
            label="消息通知"
            description="收到新消息时显示通知"
            checked={notifications}
            onChange={setNotifications}
          />
        </div>
      </section>

      {/* 开发者选项 */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">🛠️ 开发者选项</h2>
        
        <div className="space-y-4">
          <ToggleItem
            label="调试模式"
            description="在控制台显示 Bridge 调用日志"
            checked={debugMode}
            onChange={setDebugMode}
          />
        </div>
      </section>

      {/* 关于 */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">ℹ️ 关于</h2>
        
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Shittim OS</strong> v0.1.0-alpha</p>
          <p>Origin of Miracles 项目</p>
          <p className="text-gray-400">Made with ❤️ for Blue Archive</p>
        </div>
      </section>
    </div>
  )
}

interface ToggleItemProps {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleItem({ label, description, checked, onChange }: ToggleItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-gray-200'
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
