import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { LiveCanvas } from '@use-gpu/react'

import { LiveBackground } from '../live/LiveBackground'
import { useSettingsStore } from '@/stores/settingsStore'

interface MainLayoutProps {
  children: ReactNode
}

// SVG 图标组件
const icons = {
  home: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  momotalk: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  students: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  tasks: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
}

type IconKey = keyof typeof icons

const navItems: { path: string; label: string; iconKey: IconKey }[] = [
  { path: '/home', label: '首页', iconKey: 'home' },
  { path: '/momotalk', label: 'MomoTalk', iconKey: 'momotalk' },
  { path: '/students', label: '学生', iconKey: 'students' },
  { path: '/tasks', label: '任务', iconKey: 'tasks' },
  { path: '/settings', label: '设置', iconKey: 'settings' },
]

export function MainLayout({ children }: MainLayoutProps) {
  const zoom = useSettingsStore(s => s.zoom) / 100;
  return (
    <>
      <div className="use-gpu">
        <LiveCanvas style={{"borderRadius": 16 * zoom}}>
          {(canvas) => <LiveBackground canvas={canvas} zoom={zoom}/>}
        </LiveCanvas>
      </div>

      <div id="main-container" className="flex h-full w-full overflow-hidden" style={{"zoom": zoom}}>
        {/* 侧边导航栏 - 粉色主题 */}
        <nav className="w-20 bg-linear-to-b from-white to-pink-50/50 backdrop-blur-sm border-r border-pink-100/60 flex flex-col py-4">
          <div className="flex-1 flex flex-col gap-1.5 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-linear-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/25'
                      : 'text-gray-500 hover:bg-pink-100/50 hover:text-primary'
                  )
                }
              >
                {icons[item.iconKey]}
                <span className="text-[11px] mt-1.5 font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Logo - 什亭之箱 */}
          <div className="px-2 pt-4 border-t border-pink-100/60">
            <div className="flex flex-col items-center text-primary/60">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="text-[10px] mt-1 font-medium">Shittim</span>
            </div>
          </div>
        </nav>

        {/* 主内容区 */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
