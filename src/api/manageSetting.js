/** 管理设置 */
import axios from '@/libs/api.request'

export const updateApi = (data) => {
  return axios.request({
    url: '/newApi/gconfig/update',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const getVideoStatement = () => {
  return axios.request({
    url: '/newApi/gconfig/getVideoStatement',
    method: 'get'
  })
}

export const getClassify = () => {
  return axios.request({
    url: '/newApi/label/videoList',
    method: 'get'
  })
}

export const addClassify = (data) => {
  return axios.request({
    url: '/newApi/label/add',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const updateClassify = (data) => {
  return axios.request({
    url: '/newApi/label/update',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const deleteClassify = (data) => {
  return axios.request({
    url: '/newApi/label/del',
    data: JSON.stringify(data),
    method: 'post'
  })
}
