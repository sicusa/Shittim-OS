# Shittim OS

什亭之箱 - Origin of Miracles 游戏内 UI 系统

## 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite 5
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **路由**: React Router 6

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 项目结构

```
src/
├── bridge/           # MiracleBridge SDK 封装
├── components/       # UI 组件
│   ├── common/       # 通用组件
│   └── layout/       # 布局组件
├── pages/            # 页面组件
│   ├── Home/         # 首页
│   ├── MomoTalk/     # 聊天
│   ├── Students/     # 学生
│   ├── Tasks/        # 任务
│   └── Settings/     # 设置
├── hooks/            # 自定义 Hooks
├── stores/           # Zustand 状态
├── styles/           # 全局样式
├── App.tsx           # 应用根组件
├── main.tsx          # 入口文件
└── router.tsx        # 路由配置
```

## 开发指南

在 Minecraft 中使用:

1. 启动开发服务器: `pnpm dev`
2. 启动 Minecraft (需加载 Miracle Bridge 模组)
3. 进入游戏后按 `F12` 打开浏览器
4. 访问 `http://localhost:5173`

## 文档

- [开发指南](https://origin-of-miracles.github.io/Docs/dev/shittim_os_dev_guide)
- [功能规划](https://origin-of-miracles.github.io/Docs/dev/shittim_os_roadmap)

## 许可证

AGPL-3.0