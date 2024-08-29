/** 全局管理 */
import axios from '@/libs/api.request'

// 套餐管理
export const getPackagelistApi = (data) => {
  return axios.request({
    url: '/pack/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const setUpdatePackageStatusApi = (data) => {
  return axios.request({
    url: '/pack/update',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const addPackageApi = (data) => {
  return axios.request({
    url: '/pack/add',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const deletePackageApi = (data) => {
  return axios.request({
    url: '/pack/del',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const updatePackageApi = (data) => {
  return axios.request({
    url: '/pack/update',
    data: JSON.stringify(data),
    method: 'post'
  })
}
