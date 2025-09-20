/** 财务管理 */
import axios from '@/libs/api.request'

// 对账信息
export const getReconciliationApi = () => {
  return axios.request({
    url: '/moneyLog/reconciliation',
    method: 'get'
  })
}

// 提现信息
export const getMoneyListApi = (data) => {
  return axios.request({
    url: '/moneyLog/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

/** 提现记录 */
export const getWithdrawalListApi = (data) => {
  return axios.request({
    url: '/withdrawal/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

/**
 * 导出待打款数据
 */
export const exportMoneyListApi = () => {
  return axios.request({
    url: '/withdrawal/export',
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * 导入转账结果
 */
export const importResultApi = (data) => {
  return axios.request({
    url: '/withdrawal/import',
    data: JSON.stringify(data),
    method: 'post'
  })
}
