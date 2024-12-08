/** 视频审核 */
import axios from '@/libs/api.request'

// 审核视频
export const checkWorkListtApi = (data) => {
  return axios.request({
    url: '/works/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const applyPassApi = (id) => {
  return axios.request({
    url: `/works/upVideo/${id}`,
    method: 'get'
  })
}

export const applyNotPassApi = (id) => {
  return axios.request({
    url: `/works/dhVideo/${id}`,
    method: 'get'
  })
}

export const removeVideosApi = (id) => {
  return axios.request({
    url: `/works/downVideo/${id}`,
    method: 'get'
  })
}

// 达人视频
export const getUserVideolistApi = (data) => {
  return axios.request({
    url: '/works/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const getUserItemApi = (id) => {
  return axios.request({
    url: '/user/info/' + id,
    method: 'get'
  })
}

// 客服

export const historyChatApi = (data) => {
  return axios.request({
    url: '/chatRecord/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}
