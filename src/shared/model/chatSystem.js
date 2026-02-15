// ChatSystem.js
import { SocketUser } from "./appModels"
import { Messages, MsgModel } from "./msgModel"
import { getPcId } from "../../services/toolFuncs"

export class ChatSystem {

  /* ========= 常量 ========= */

  static CallMode = Object.freeze({
    VIDEO: 'video',
    AUDIO: 'audio',
  })

  static CallStatus = Object.freeze({
    IDLE: 'idle',
    CALLING: 'calling',
    CONNECTED: 'connected',
    ENDED: 'ended'
  })

  /* ========= 状态 ========= */

  static users = new Map()

  // 🔒 保持对象引用稳定（非常重要）
  static call = {
    target_user: null,
    mode: null,
    isInit: true,
    status: ChatSystem.CallStatus.IDLE
  }

  // 👉 当前文字聊天对象（仅 UI 视图）
  static activeChatUserId = null

  /* ========= 订阅系统 ========= */

  static listeners = {
    call: new Set(),
    chat: new Set(),
    user: new Set()
  }

  static subscribe(type, fn) {
    this.listeners[type]?.add(fn)
    return () => this.listeners[type]?.delete(fn)
  }

  static notify(type, payload) {
    this.listeners[type]?.forEach(fn => fn(payload))
  }

  /* ========= 消息 ========= */

  static sendMessage(msg) {
    msg.status = MsgModel.msgStatus.sent
    Messages.add(msg, 'out')

    this.notify('chat', {
      type: 'message',
      message: msg
    })

  }

  static getMessagesBetween(a, b) {
    return Messages.between(a, b)
  }

  static getUnreadFor(uid) {
    return Messages.unreadFor(uid)
  }

  static markRead(uid) {
    Messages.markRead(uid)
    this.notify('chat', { type: 'read', uid })
  }

  /* ========= 用户 ========= */

  static getUsers() {
    return [...this.users.values()]
  }

  static getUser(id) {
    return this.users.get(id)
  }

  /* ========= 文字聊天（完全独立） ========= */
  static addUser(user) {
    this.activeChatUserId = user.id || user.pc_id || user.from_sid
    if (!this.users.has(this.activeChatUserId)) {
      this.users.set(this.activeChatUserId, user)
      this.notify('user', { type: 'add', user })
    }
  }

  static switchTargetUser(data, from) {
    
    const su = new SocketUser()
    su.createTarget(data,from)
     
    this.addUser(su)
    this.markRead(su.id)
    this.notify('chat', {
      type: 'switch',
      userId: su.id
    })
    return true
  }

  static getActiveChatUser() {
    if (!this.activeChatUserId) {
      console.warn('no active user')
      return
    }

    return this.users.get(this.activeChatUserId)
  }

  /* ========= 通话（独立域） ========= */

  static requestCall(target_user, from_user, room, mode = ChatSystem.CallMode.VIDEO) {
    this.call.target_user = target_user
    this.call.mode = mode
    this.call.isInit = true
    this.call.status = ChatSystem.CallStatus.CALLING

    this.notify('call', { type: 'request', target_user, mode })

    return {
      type: 'call_request',
      to: target_user?.pc_id,
      room,
      from: from_user || getPcId(true)
    }
  }
  static callResponse(data) {
    if (data.accept) {
      this.call.target_user = data.target_user
      this.call.mode = this.CallMode.VIDEO
      this.call.isInit = false
      this.call.status = this.CallStatus.CALLING

    }
    return {
      type: 'call_response',
      toSid: data.target_user,
      room: data.room,
      accept: data.accept
    }

  }

  static getSignal(data) {
    console.log('get signal in calluser', data)
  }

  static receiveCallRequest(action) {
    this.call.target_user = { id: action.from }
    this.call.mode = action.mode
    this.call.status = ChatSystem.CallStatus.CALLING

    this.notify('call_request', { type: 'incoming', action })
  }

  static connected() {
    this.call.status = ChatSystem.CallStatus.CONNECTED
    this.notify('call', { type: 'connected' })
  }

  static endCall() {
    this.call.target_user = null
    this.call.mode = null
    this.call.status = ChatSystem.CallStatus.ENDED

    this.notify('call', { type: 'ended' })
  }

  static isInCall() {
    return this.call.status === this.CallStatus.CALLING
      || this.call.status === this.CallStatus.CONNECTED
  }

  /* ========= 文件请求（只做“意图”） ========= */

  static requestFile(user, room, from, fileMeta) {
    const data = { toPc: user.pc_id, room, from, toSid: user.sid }
    this.notify('chat', { type: 'file_request', data })

    return {
      type: 'file_request',
      toPc: user.pc_id,
      room,
      from: user.username,
      toSid: user.sid,
      file: {
        name: fileMeta.name,
        size: fileMeta.size,
        mime: fileMeta.type
      }
    }
  }

  static receiveFileRequest(action) {

    this.notify('chat', { type: 'send_request', action })
  }
}
