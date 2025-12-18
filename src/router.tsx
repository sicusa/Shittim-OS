import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { HomePage } from '@/pages/Home'
import { MomoTalkPage } from '@/pages/MomoTalk'
import { StudentsPage } from '@/pages/Students'
import { TasksPage } from '@/pages/Tasks'
import { SettingsPage } from '@/pages/Settings'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/momotalk',
    element: <MomoTalkPage />,
  },
  {
    path: '/momotalk/:studentId',
    element: <MomoTalkPage />,
  },
  {
    path: '/students',
    element: <StudentsPage />,
  },
  {
    path: '/students/:studentId',
    element: <StudentsPage />,
  },
  {
    path: '/tasks',
    element: <TasksPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]
