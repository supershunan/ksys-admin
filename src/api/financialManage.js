/** 财务管理 */
import axios from '@/libs/api.request'

// 对账信息
export const getReconciliationApi = () => {
  return axios.request({
    url: '/newApi/moneyLog/reconciliation',
    method: 'get'
  })
}

// 提现信息
export const getMoneyListApi = (data) => {
  return axios.request({
    url: '/newApi/moneyLog/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}
