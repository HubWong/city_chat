import { ChatSystem } from './chatSystem'
import SocketClient from './socketModel'
import { Events } from './eventModel'
import { Messages } from './msgModel';
import { TransModel } from './appModels';
import { getPcId } from '../../services/toolFuncs';

class ChatBridge {

    static socket = SocketClient.get()
    /* ========= 发 ========= */

    static dispatch(event, meta) {
        if (!this.socket) {
            console.error('sockt no defined')
            return
        }
        if (meta) {
            this.socket.emit(event, meta)
        }
        else {
            this.socket.emit(event)
        }
    }

    static sendInvite(fromUname, room) {
        const mdl = new TransModel()
        const u = ChatSystem.getActiveChatUser()
        if (u) {
            this.dispatch('invite_chat', { to: u.pc_id, from_pc_id: getPcId(), from: fromUname, room })
            mdl.success = true
        } else {
            mdl.msg = 'no active user'
        }
        return mdl
    }
    static sendMsg(msg,isRoom=false) {
        if(isRoom){
            this.dispatch('send_room_msg',msg)
            ChatSystem.sendMessage(msg)
            return
        }
        ChatSystem.sendMessage(msg)
        this.dispatch('send_msg', msg)
    }
    static updateMe(data) {

        const isValidate = () => {
            return data.birth_year && data.gender && data.username
        }
        let result = false;
        if (isValidate()) {
            this.dispatch('update_info', data)
            result=true
        } 
        return result
    }
    static clean(id) {
        Messages.cleanMsgs(id)
    }


    static startCall(user, from_user, room, mode) {
        const action = ChatSystem.requestCall(user, from_user.username, room, mode)
        this.dispatch('call_request', action)
    }

    static callResponse(data) {
        const action = ChatSystem.callResponse(data)
        this.dispatch('call_response', action)
    }


    static sendFileRequest(user, room, from, file) {
        const action = ChatSystem.requestFile(user, room, from, file)
        this.dispatch('file_request', action)
    }
    static sendRespons({ accept, room, toSid, toPc }) {
        const data = { accept, room, toSid, toPc }
        this.dispatch('file_response', data)
    }
    
    static requestUsers() {
        this.dispatch('req_users')
    }

    static leave_room(room,type='p2p') {
        if(type!=='p2p'){
            this.dispatch('leave_pubroom',{room})
            return
        }
        this.dispatch('leave', { room })
    }

    static end_call(toSid) {
        ChatSystem.endCall()
        this.dispatch('end_call', { toSid })
    }
    static join_p2p(data) {
        this.dispatch('join_p2p', data)
    }

    static join_user_room(data){
      
        this.dispatch('join_user_room',data)
    }

 

    /* ========= 收 ========= */

    static bind(socket) {
        if (!socket) {
            return
        }
        this.socket = socket
       
        this.socket.on('notify', content => {
            const { msg_type } = content
            if (msg_type === "user_disconnect" || msg_type === "user_connect") {
                return
            }

            const m = Messages.add(content, 'in');
            Events.emit('notify', m);

        })

        this.socket.on('rtc_action', action => {
            const { data } = action
            this.handle(data)
        })

        this.socket.on('file_request', meta => {
            const { data } = meta
            this.handle(data)
        })
        // this.socket.on('file_response', data => {
        //     this.handle(data)

        // })
        this.socket.on('error_msg', error => {
            const { data } = error;
            Events.emit('error_msg', data)

        })
    }

    static handle(action) {
        switch (action.msg_type) {
            case 'video_signal':
                Events.emit('signal', action)
                break
            case 'calling':
                if (ChatSystem.isInCall()) {
                    console.error('user is in calling with others')
                }
                ChatSystem.receiveCallRequest(action)
                Events.emit('calling', action)
                break

            case "call_accepted":
                ChatSystem.connected()
                Events.emit('call_accepted', action)
                break

            case 'hangup':
            case 'call_rejected':
                ChatSystem.endCall()
                Events.emit('hangup', action)
                break

            case 'send_request':
                Events.emit('notify', action)
                ChatSystem.receiveFileRequest(action)
                break
            case 'file_response':
                Events.emit('file_response', action)
                break
            default:
                console.warn('Unknown action', action)
        }
    }
}

export default ChatBridge
