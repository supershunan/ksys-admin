import axios from '@/libs/api.request'

export const pageData = (data) => {
  return axios.request({
    url: '/api/works/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const listFolderApi = () => {
  return axios.request({
    url: '/api/works/listFolder',
    method: 'get'
  })
}

export const upVideoApi = (id) => {
  return axios.request({
    url: '/api/works/upVideo/' + id,
    method: 'get'
  })
}

export const downVideoApi = (id) => {
  return axios.request({
    url: '/api/works/downVideo/' + id,
    method: 'get'
  })
}

export const addVideoData = (data) => {
  return axios.request({
    url: '/api/works/addVideo',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const addFolderData = (data) => {
  return axios.request({
    url: '/api/works/addFolder',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const updateData = (data) => {
  return axios.request({
    url: '/api/works/update',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const infoData = (id) => {
  return axios.request({
    url: '/api/works/info/' + id,
    method: 'get'
  })
}

export const infoAllData = (id) => {
  return axios.request({
    url: '/api/works/infoAll/' + id,
    method: 'get'
  })
}

export const delData = (data) => {
  return axios.request({
    url: '/works/del',
    data: JSON.stringify(data),
    method: 'post'
  })
}
