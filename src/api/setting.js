/** 设置 */
import axios from '@/libs/api.request'

export const getAdminListApi = (data) => {
  return axios.request({
    url: '/user/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const addAdminApi = (data) => {
  return axios.request({
    url: '/user/addAdmin',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const deleteAdminApi = (data) => {
  return axios.request({
    url: '/user/del',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const updateAdminApi = (data) => {
  return axios.request({
    url: '/user/updateBySadmin',
    data: JSON.stringify(data),
    method: 'post'
  })
}
