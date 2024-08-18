import axios from '@/libs/api.request'

export const pageData = (data) => {
  return axios.request({
    url: '/api/apply/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const listData = (data) => {
  return axios.request({
    url: '/api/apply/list',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const infoData = (id) => {
  return axios.request({
    url: '/api/apply/info/' + id,
    method: 'get'
  })
}

export const submitCashData = (data) => {
  return axios.request({
    url: '/api/apply/submitCash',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const audData = (data) => {
  return axios.request({
    url: '/api/apply/aud',
    data: JSON.stringify(data),
    method: 'post'
  })
}
