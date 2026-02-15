import Login from './page/Login'
import Register from './page/Register'
import PwdResetForm from './comp/PwdResetForm'
import ResetPwdRequest from './page/ResetPwdRequest'

export const authRoutes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/sign_up',
    element: <Register />,
  },
  { path: "/reset_req", element: <ResetPwdRequest /> },
  { path: "/pwd_reset/:tkn", element: <PwdResetForm /> },
]