import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'

interface MainLayoutProps {
  children: ReactNode
}

const navItems = [
  { path: '/home', label: '首页', icon: '🏠' },
  { path: '/momotalk', label: 'MomoTalk', icon: '💬' },
  { path: '/students', label: '学生', icon: '👥' },
  { path: '/tasks', label: '任务', icon: '📋' },
  { path: '/settings', label: '设置', icon: '⚙️' },
]

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* 侧边导航栏 */}
      <nav className="w-20 bg-white/80 backdrop-blur-sm border-r border-gray-200 flex flex-col py-4">
        <div className="flex-1 flex flex-col gap-2 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                )
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Logo */}
        <div className="px-2 pt-4 border-t border-gray-200">
          <div className="flex flex-col items-center text-gray-400">
            <span className="text-lg">📱</span>
            <span className="text-[10px] mt-1">Shittim</span>
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
  )
}
