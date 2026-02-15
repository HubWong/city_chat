import UserListPage from "./page"
import ResumeDetail from "./page/ResumeDetail"
import PublicLayout from '@/Layouts/PublicLayout'

export const userRoutes = [
    { path: 'user', element: <UserListPage /> },
    { path: 'user/:id', element: <ResumeDetail /> }
]