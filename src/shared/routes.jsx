
import { authRoutes } from "../pages/auth";
import { adminRoutes } from "../pages/admin/routes";
import { roomRoutes } from "../pages/Chat/route";
import { userRoutes } from "../pages/ViewUser/route";
import { indexRoutes } from '../pages/Landing/route'

import PublicLayout from "../Layouts/PublicLayout";
import { centerRoutes } from "../pages/Profile/route";
import { createBrowserRouter } from "react-router-dom";

const _routesArray = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      ...indexRoutes,
      ...authRoutes,
      ...roomRoutes,
      ...centerRoutes,
      ...userRoutes
    ],
  },
  ...adminRoutes
];


export const routesArray = createBrowserRouter(_routesArray)
