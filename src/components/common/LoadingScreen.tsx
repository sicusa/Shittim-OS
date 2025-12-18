/**
 * 加载屏幕组件
 */
export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-secondary to-secondary-dark">
      <div className="text-center">
        {/* Logo */}
        <div className="text-6xl mb-4 animate-pulse">📱</div>
        
        {/* 标题 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Shittim OS
        </h1>
        <p className="text-gray-500 mb-8">什亭之箱</p>
        
        {/* 加载动画 */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        
        {/* 状态文字 */}
        <p className="text-sm text-gray-400 mt-4">
          正在连接 Minecraft...
        </p>
      </div>
    </div>
  )
}
