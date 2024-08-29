/** 用户管理 */
import axios from '@/libs/api.request'

// 用户信息 达人信息
export const getUserInfolistApi = (data) => {
  return axios.request({
    url: '/user/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

// 达人信息
export const UpgradeToleaderApi = (data) => {
  return axios.request({
    url: '/user/setCommander',
    data: JSON.stringify(data),
    method: 'put'
  })
}

// 专属会员
export const getExpertListApi = (data) => {
  return axios.request({
    url: '/user/pageEvip',
    data: JSON.stringify(data),
    method: 'post'
  })
}
