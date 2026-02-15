
import MeetingRoomPage from './page/MeetingRoomPage'
import PubRoom from "./page/PubRoom";
import P2pRoom from './page/P2pRoom'
import IndexPage from './page/RoomIndexPage';
import UserRoomPage from './page/UserRoomPage';

export const roomRoutes = [

    { path: "chat", element: <IndexPage /> },
    { path: "room/:roomId/:mySid/:maker", element: <MeetingRoomPage /> },
    { path: "room_cn/:name", element: <PubRoom /> },
    { path: "room_prv/:cId/:init", element: <P2pRoom /> },
    { path: "room/:id", element: <UserRoomPage /> }


]