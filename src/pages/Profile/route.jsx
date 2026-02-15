
import RequireAuth from '@/Layouts/RequireAuth'
import AuthendLayout from '@/Layouts/AuthendLayout'
import MessagePage from '../Msg/MessagePage'
import Profile from './page'
import PasswordChange from './page/PasswordChange'
import SetupIndex from './setups/SetupIndex'
import OrderList from './setups/OrderList'
import AlbumPage from './page/AlbumPage'
import UserPalsPage from './page/UserPalsPage'
import CooperIndex from './page/CooperIndex'
import UserRoomMge from './page/UserRoomMge'
import EditRoom from './page/EditRoom'

export const centerRoutes = [
    {
        path: "/center",
        element: (
            <RequireAuth>
                <AuthendLayout />
            </RequireAuth>
        ),
        children: [
            { index: true, element: <MessagePage /> },
            { path: "msg", element: <MessagePage /> },
            { path: "profile", element: <Profile /> },
            { path: 'pwd_change', element: <PasswordChange /> },
            {
                path: "setups",
                element: <SetupIndex />
            },
            { path: 'setups/orders', element: <OrderList /> },
            { path: "user_photos", element: <AlbumPage /> },
            { path: "pals", element: <UserPalsPage /> },
            { path: "iamcooper", element: <CooperIndex /> },
            { path: "user_room/:roomId", element: <EditRoom /> },
            { path: "user_room", element: <UserRoomMge /> },
            
        ],
    },
]