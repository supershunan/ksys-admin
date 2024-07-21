export const applyTypeMap = { "exp":"达人入筑申请","video":"视频上架申请","cash":"提现申请","refund":"退款申请" }
export const applyStatusMap = { 1:{v:"审核中",c:"primary"},2:{v:"未通过",c:"error"},9:{v:"已通过",c:"success"} }

export const userSexMap = { 1:"男",2:"女" }
export const userTypeMap = { "sadmin":{ v:"超级管理员",c:"blue" },"admin":{ v:"普通管理员",c:"blue" },"publicize":{ v:"推广员",c:"blue" },
"expert":{ v:"达人",c:"blue" },"user":{ v:"用户",c:"blue" } }
export const userVipTypeMap = { "user":{ v:"普通用户",c:"blue" },"platform":{ v:"平台会员",c:"red" },"expert":{ v:"专属会员",c:"orange" } }
export const userStatusMap = { "1":{ v:"正常",c:"blue" },"2":{ v:"封禁",c:"error" },"3":{ v:"审核",c:"orange" } }

export const moneyLogTypeMap = { "consume":{ v:"消费",c:"red" },"recharge":{ v:"充值",c:"green" },"income":{ v:"收益",c:"green" }
,"dividend":{ v:"分红",c:"green" },"cash":{ v:"提现",c:"orange" },"refund":{ v:"退回",c:"blue" } }

export const orderTypeMap = { "works":{ v:"作品订单",c:"blue" },"vip":{ v:"会员订单",c:"red" } }
export const orderPayTypeMap = { "wx":{ v:"微信",c:"green" },"al":{ v:"支付宝",c:"blue" } }
export const orderStatusMap = { 1:{ v:"待付款",c:"primary" },2:{ v:"已支付",c:"warning" },3:{ v:"申请退款",c:"warning" },4:{ v:"退款驳回",c:"warning" }
,5:{ v:"已退款",c:"error" },6:{ v:"已取消",c:"error" },99:{ v:"已完成",c:"success" } }

export const worksTypeMap = { 'folder':{ v:"合集",c:"orange" },'video':{ v:"视频",c:"blue" } }
export const worksStatusMap = { 1:{ v:"正常",c:"primary" },2:{ v:"审核中",c:"warning" },3:{ v:"打回",c:"error" },4:{ v:"强制下架",c:"error" },5:{ v:"自行下架",c:"warning" } }

export const vipTypeMap = { 'platform':{ v:"平台会员",c:"error" },'expert':{ v:"专属会员",c:"warning" } }

export const packTypeMap = { 'video':{ v:"视频套餐",c:"red" },'recharge':{ v:"充值",c:"blue" } }
export const packUseMap = { 1:{ v:"使用中",c:"primary" },2:{ v:"停用",c:"error" } }

export const fileSuffixs = {
    image: ["png","jpg","jpeg"],
    video: ["mp4"],
    audio: ["mp3"]
}