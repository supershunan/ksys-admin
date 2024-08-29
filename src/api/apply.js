import axios from '@/libs/api.request'

export const pageData = (data) => {
  return axios.request({
    url: '/apply/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const listData = (data) => {
  return axios.request({
    url: '/apply/list',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const infoData = (id) => {
  return axios.request({
    url: '/apply/info/' + id,
    method: 'get'
  })
}

export const submitCashData = (data) => {
  return axios.request({
    url: '/apply/submitCash',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const audData = (data) => {
  return axios.request({
    url: '/apply/aud',
    data: JSON.stringify(data),
    method: 'post'
  })
}
