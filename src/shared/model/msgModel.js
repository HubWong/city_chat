import { getPcId } from "../../services/toolFuncs";
export class MsgModel {
    static msgStatus = {
        sending: 'sending',
        sent: 'sent',
        recall: 'recall',
        newGot: 'newGot',
        sys: 'sys'
    };

    static socketMsgType = {
        chat: 'chat',
        chat_image: 'chat_image',
        call: 'call'
    };

    constructor(raw = {}) {
        this.msg_id = raw.msg_id || raw.id || crypto.randomUUID();
        this.msg_type = raw.msg_type || MsgModel.socketMsgType.chat;
        this.from_sid = raw.from_sid || '';
        this.from_user = raw.from_user || null;
        this.from_pc_id = raw.from_pc_id || raw.data?.from_pc_id;
        this.to_pc_id = raw.pc_id || raw.to_pc_id || ''
        this.to_sid = raw.to_sid || '';
        this.to_user = raw.to_user || null;

        // 统一 data 为对象结构；兼容旧字符串格式
        if (typeof raw.data === 'string') {
            this.data = { content: raw.data, rmt: raw.rmt || 'message' };
        } else if (raw.data && typeof raw.data === 'object') {
            if (raw.msg_type === MsgModel.socketMsgType.chat_image) {
                raw.data['rmt'] = 'img_msg'
                console.log('changes to imag msg.')
            }
            this.data = raw.data;
        } else {
            this.data = { content: '<unknown content>' };
        }

        this.status = raw.status || MsgModel.msgStatus.newGot;
        this.ifRead = raw.ifRead ?? false;
        this.to_room = raw.to_room || '';
        this.ts = raw.ts || Date.now();
    }

    markRead() {
        this.ifRead = true;
    }
    /*
    joined room 
    left room
    user disconnected
    */
    static createSysRoomMsg(room, typ = 'new_create') {
        const msg = new MsgModel()
        let content = 'user joined'
        if (typ === 'disconnected') {
            content = 'user disconnected'
        } else if (typ == 'left') {
            content = 'user left'
        } else {
            content = '房间已经建立'
        }
        msg.to_room = room
        msg.data = { content, rmt: 'sys' }
        msg.ts = Date.now()       
        msg.from_user = 'sys'
        
        return msg
    }
  // createOutgoing(messageInput.trim(), room, '', socket?.id, user)
    // ✅ 改为静态工厂方法，语义清晰
 
    static createOutgoing(text, room, targetUser, fromSid, user, msgType = MsgModel.socketMsgType.chat) {
      
        return new MsgModel({
            msg_id: crypto.randomUUID(),
            msg_type: msgType,
            to_pc_id: targetUser.pc_id,
            to_sid:targetUser.sid,
            from_sid: fromSid,
            from_user: user.email ||user.from_user,            
            data: { content: text, rmt: 'message' },           
            to_room: room,
            ts: Date.now(),
            from_pc_id: getPcId()           

        });
    }

    recall() {

        this.status = MsgModel.msgStatus.recall;
        this.data = { content: '' };
    }

    toJSON() {
        return { ...this };
    }
}

export class Messages {
    static store = new Map();
    static listeners = new Set();

    static subscribe(fn) {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }

    static notify() {
        this.listeners.forEach(fn => fn());
    }

    static add(raw, type = 'local') {
        
        let data = {}
        switch (type) {
            case 'in':
                data = { status: MsgModel.msgStatus.newGot, ifRead: false }
                break;
            case 'out':
                data = { status: MsgModel.msgStatus.sent, ifRead: true }
                break;
            default: //local
                data = { status: MsgModel.msgStatus.sys, ifRead: true }
                break;
        }
        raw = { ...raw, ...data }
        const msg = raw instanceof MsgModel ? raw : new MsgModel(raw);
        
        Messages.store.set(msg.msg_id, msg);
        Messages.notify();
        return msg;
    }

    static get(id) {
        return Messages.store.get(id);
    }

    static all() {
        return [...Messages.store.values()];
    }

    static between(a, b) {
        return Messages.all().filter(
            m => (m.from_pc_id === a && m.pc_id === b) ||
                (m.from_pc_id === b && m.pc_id === a)
        );
    }

    static roomMsgs(room) {

        console.log('->get msg from:', room)

        return Messages.all().filter(m => m.to_room === room || m.room === room)
    }

    static unreadFor(sid) {
        return this.all().filter(m => m.to_sid === sid && !m.ifRead);
    }


    static cleanMsgs(id) {
        if (id) {
            Messages.store = Messages.store.filter(item => item.from_sid !== id);
        } else {
            Messages.store = new Map()
            console.log('mesg cleaned.')
        }
        this.notify()
    }

    static markRead(id) {
        const m = this.get(id);
        if (m) {
            m.markRead();
            Messages.notify();
        }
    }

    static recall(id) {
        const m = this.get(id);
        if (m) {
            m.recall();
            Messages.notify();
        }
    }
}