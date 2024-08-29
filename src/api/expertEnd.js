/** 达人端 */
import axios from '@/libs/api.request'

// 公告 教程 推广详情 设置
export const getDeviceList = (type) => {
  return axios.request({
    url: `/gconfig/getByType/${type}`,
    method: 'get'
  })
}

export const getDeviceListPage = (type, page, rows) => {
  return axios.request({
    url: `/gconfig/pages/${type}?page=${page}&rows=${rows}`,
    method: 'get'
  })
}

export const addDevice = (data) => {
  return axios.request({
    url: '/gconfig/add',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const updateDevice = (data) => {
  return axios.request({
    url: '/gconfig/update',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const deleteDevice = (id) => {
  return axios.request({
    url: `/gconfig/delete/${id}`,
    method: 'delete'
  })
}

export const getNoticeListApi = (data) => {
  return axios.request({
    url: '/noticeList/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const addNoticeApi = (data) => {
  return axios.request({
    url: '/noticeList/add',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const deleteNoticeApi = (data) => {
  return axios.request({
    url: '/noticeList/del',
    data: JSON.stringify(data),
    method: 'post'
  })
}

// 信息
export const getFeedbackListApi = (data) => {
  return axios.request({
    url: '/feedback/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const deleteFeedbackApi = (data) => {
  return axios.request({
    url: '/feedback/del',
    data: JSON.stringify(data),
    method: 'post'
  })
}
