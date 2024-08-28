import axios from '@/libs/api.request'

export const getVipConfig = () => {
  return axios.request({
    url: '/newApi/vip/getVipConfig',
    method: 'get'
  })
}

export const updateVipConfig = (data) => {
  return axios.request({
    url: '/newApi/vip/updateVipConfig',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const expertListApi = () => {
  return axios.request({
    url: '/newApi/vip/expertList',
    method: 'get'
  })
}

export const platListApi = () => {
  return axios.request({
    url: '/newApi/vip/platList',
    method: 'get'
  })
}

export const addEvipTimeApi = (data) => {
  return axios.request({
    url: '/newApi/userVip/addEvipTime',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const addVipTimeApi = (data) => {
  return axios.request({
    url: '/newApi/userVip/addVipTime',
    data: JSON.stringify(data),
    method: 'post'
  })
}
