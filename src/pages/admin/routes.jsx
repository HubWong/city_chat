// features/admin/routes.jsx
import AdminLayout from '../../Layouts/AdminLayout'
import RequireAuth from '@/Layouts/RequireAuth'
import DashboardPage from './page/DashboardPage'
import UserManagement from './comp/UserManagement'
import PaymentMangement from './comp/PaymentManagement'
import SystemSettings from './comp/SystemSettings'
import UserPhotoMg from './comp/UserPhotoMg'
import AppMsgManagement from './comp/AppMsgManagement'
import CooperMangement from './comp/CooperManagement'
import RoomManage from './comp/RoomManage'

export const adminRoutes = [
    {
        path: 'admin',
        element: (
            <RequireAuth>
                <AdminLayout />
            </RequireAuth>
        ),
        children: [
            { index: true, element: <DashboardPage /> },
            { path: 'dashboard', element: <DashboardPage /> },
            { path: 'users', element: <UserManagement /> },
            { path: 'payment', element: <PaymentMangement /> },
            { path: 'settings', element: <SystemSettings /> },
            { path: 'photos', element: <UserPhotoMg /> },
            { path: 'appMsgs', element: <AppMsgManagement /> },
            { path: 'front', element: <UserManagement /> },
            { path: 'coopers', element: <CooperMangement /> },
            { path: 'rooms', element: <RoomManage /> },

        ],
    },
]
