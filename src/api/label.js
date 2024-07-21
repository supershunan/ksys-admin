import axios from '@/libs/api.request'

export const videoListData = () => {
  return axios.request({
    url: '/label/videoList',
    method: 'get'
  })
}