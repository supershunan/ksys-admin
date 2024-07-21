import axios from '@/libs/api.request'

export const pageData = (data) => {
  return axios.request({
    url: '/order/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const delData = (data) => {
  return axios.request({
    url: '/order/del',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const infoData = (id) => {
  return axios.request({
    url: '/order/info/'+id,
    method: 'get'
  })
}

export const backData = (id) => {
  return axios.request({
    url: '/user/back/'+id,
    method: 'get'
  })
}