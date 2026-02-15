import { io } from "socket.io-client";
import { SOCKET_URL } from "@/shared/config";
import { SocketUser } from "./appModels";
import { getPcId } from "../../services/toolFuncs";
class SocketClient {

    static _instance = null
    static _userData = null
    static _isConnected = false
    // 初始化或更新用户数据
    static setUserData({ user, ipInfo }) {
        if (!this._userData) {
            this._userData = new SocketUser()
            this._userData.pc_id = getPcId()
            this._userData.dowry = '0'
        }

        // 只更新变化部分
        this._userData.username = user?.username
        this._userData.gender = user?.gender
        this._userData.birth_year = user?.birth_year
        this._userData.id = user?.id || getPcId()
        this._userData.ip_country = ipInfo?.country
        this._userData.ip_city = ipInfo?.city
        
    }

    static get userData() {
        return this._userData
    }
    static reset() {
        this._instance?.disconnect()
        this._instance = null
        this._userData = null
        this._isConnected = false
    }
    static get isConnected() {
        return this._isConnected
    }
    static get() {
        if (!this._instance) {
            if (!this._userData) {
                console.warn("SocketClient: userData 尚未初始化")
                return
            }

            this._instance = io(SOCKET_URL, {
                path: "/ws",
                query: {
                    data: JSON.stringify(this._userData),
                },
                transports: ["websocket"],
                reconnectionAttempts: 5,
                timeout: 10000,
            })
            // 🔌 连接状态监听（只注册一次）
            this._instance.on("connect", () => {
                this._isConnected = true
                console.log("🟢 Socket connected:", this._instance.id)
            })

            this._instance.on("disconnect", () => {
                this._isConnected = false
                console.error("🔴 Socket disconnected")
            })
        }

        return this._instance
    }
}

export default SocketClient
