/** 素材库 */
import axios from '@/libs/api.request'

export const getClassifyListApi = (data) => {
  return axios.request({
    url: '/source/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

// folder 文件夹  video 视频 pic 图片
export const addClassifyApi = (data) => {
  return axios.request({
    url: '/source/add',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const deleteClassifyApi = (data) => {
  return axios.request({
    url: '/source/del',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const emptyRecycleBinApi = (data) => {
  return axios.request({
    url: '/source/delRecycle',
    data: JSON.stringify(data),
    method: 'delete'
  })
}

export const updateClassifyApi = (data) => {
  return axios.request({
    url: '/source/update',
    data: JSON.stringify(data),
    method: 'post'
  })
}
