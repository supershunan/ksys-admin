import axios from '@/libs/api.request'

export const pageData = (data) => {
  return axios.request({
    url: '/newApi/pack/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const addData = (data) => {
  return axios.request({
    url: '/newApi/pack/add',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const updateData = (data) => {
  return axios.request({
    url: '/newApi/pack/update',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const changeUseData = (id) => {
  return axios.request({
    url: '/newApi/pack/changeUse/' + id,
    method: 'get'
  })
}

export const infoData = (id) => {
  return axios.request({
    url: '/newApi/pack/info/' + id,
    method: 'get'
  })
}

export const delData = (data) => {
  return axios.request({
    url: '/newApi/pack/del',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const myUseList = (id) => {
  return axios.request({
    url: '/newApi/pack/myUseList',
    method: 'get'
  })
}
