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
export const getMoneyListApi = () => {
  return axios.request({
    url: '/newApi/moneyLog/page',
    method: 'get'
  })
}
