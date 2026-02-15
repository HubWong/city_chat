export class BaseModel {
  constructor(init = {}) {
    Object.assign(this, init)
  }

  /** 返回后端可直接接收的数据 */
  toJSON() {
    const data = {}
    for (const key of this.fields()) {
      data[key] = this[key]
    }
    return data
  }

  /** 子类必须声明字段 */
  fields() {
    throw new Error('fields() must be implemented in subclass')
  }

  /** 更新数据（适合表单双向绑定） */
  update(patch = {}) {
    Object.assign(this, patch)
    return this
  }

  /** 深拷贝 */
  clone() {
    return new this.constructor(JSON.parse(JSON.stringify(this)))
  }
}

export class SocketUser extends BaseModel {
  bio = ""
  pc_id = "";
  username = null;
  gender = 0;
  ip_country = null;
  birth_year = 2003;
  id = null;
  sid = null;
  ip_city = null;
  living_city = '';
  online_time = ''
  dowry = 0;
  last_active = new Date().getTime();

  static UserNameDefn(n) {
    return `<visitor-${n.substring(0, 6)}...>`

  }

  createTarget(data, type = 'select') {
    
    switch (type) {
      case 'notify':
        this.bio = data?.bio
        this.pc_id = data.from_pc_id || ''
        this.username = data?.from_user
        this.gender = data?.gender
        this.ip_country = data?.ip_country
        this.birth_year = data?.birth_year
        this.id = data?.from_uid || data.from_sid
        this.sid = data?.from_sid
        this.ip_city = data?.ip_city
        this.living_city = data?.living_city
        this.dowry = data?.dowry
        break;
      default:
        this.pc_id = data?.pc_id
        this.username = data?.username
        this.gender = data?.gender
        this.ip_country = data?.ip_country
        this.birth_year = data?.birth_year
        this.id = data?.id
        this.sid = data?.sid
        this.living_city = data?.living_city
        this.last_active = data?.last_active
        this.online_time = data?.online_time
        break
    }


  }
  fields() {
    return ['pc_id', 'username', 'gender', 'ip_country',
      'birth_year', 'id', 'sid', 'ip_city', 'dowry'
    ];
  }
}

export const payTypes = [
  'USDT', 'USDC', 'ETH'
]

export const ChainTypes = [
  'ERC20 (ETH) ',
  'BEP20 (BSC)',
  'TRC20 (TRON)'
]

export class TransModel {
  constructor() {
    this.success = false
    this.msg = ''
    this.data = null
  }
}


export class OrderModel extends BaseModel {
  user_id = 1
  amount = 0.01
  chain = 'tron'
  currency = 'usdt'
  order_for = 'chat'

  fields() {
    return ['user_id', 'amount', 'chain', 'currency', 'order_for']
  }
}