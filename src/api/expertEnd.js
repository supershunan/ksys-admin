/** 达人端 */
import axios from '@/libs/api.request'

// 公告 教程 推广详情 设置
export const getDeviceList = (type) => {
  return axios.request({
    url: `/newApi/gconfig/getByType/${type}`,
    method: 'get'
  })
}

export const getDeviceListPage = (type, page, rows) => {
  return axios.request({
    url: `/newApi/gconfig/pages/${type}?page=${page}&rows=${rows}`,
    method: 'get'
  })
}

export const addDevice = (data) => {
  return axios.request({
    url: '/newApi/gconfig/add',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const updateDevice = (data) => {
  return axios.request({
    url: '/newApi/gconfig/update',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const deleteDevice = (id) => {
  return axios.request({
    url: `/newApi/gconfig/delete/${id}`,
    method: 'delete'
  })
}

// 信息
export const getFeedbackListApi = (data) => {
  return axios.request({
    url: '/newApi/feedback/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const deleteFeedbackApi = (data) => {
  return axios.request({
    url: '/newApi/feedback/del',
    data: JSON.stringify(data),
    method: 'post'
  })
}
