import LandingPage from "./page/LandingPage";
import AboutPage from './page/AboutPage'
import PublicLayout from '@/Layouts/PublicLayout'

export const indexRoutes = [
    
    { index: true, element: <LandingPage /> },
    { path: '/', element: <LandingPage /> },
    { path: '/about', element: <AboutPage /> },
]