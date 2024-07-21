import axios from '@/libs/api.request'

export const getAllConfig = () => {
  return axios.request({
    url: '/gconfig/getAllConfig',
    method: 'get'
  })
}

export const updateAllConfig = (data) => {
  return axios.request({
    url: '/gconfig/updateAllConfig',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const updateApi = (data) => {
  return axios.request({
    url: '/gconfig/update',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const getBanners = () => {
  return axios.request({
    url: '/gconfig/getBanners',
    method: 'get'
  })
}

export const getHomeImgs = () => {
  return axios.request({
    url: '/gconfig/getHomeImgs',
    method: 'get'
  })
}

export const getHomeVideos = () => {
  return axios.request({
    url: '/gconfig/getHomeVideos',
    method: 'get'
  })
}

export const getVideoStatement = () => {
  return axios.request({
    url: '/gconfig/getVideoStatement',
    method: 'get'
  })
}

export const getPlatWh = () => {
  return axios.request({
    url: '/gconfig/getPlatWh',
    method: 'get'
  })
}