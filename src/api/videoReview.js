/** 视频审核 */
import axios from '@/libs/api.request'

// 达人视频
export const getUserVideolistApi = (data) => {
  return axios.request({
    url: '/newnewApi/works/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const getUserItemApi = (id) => {
  return axios.request({
    url: '/user/info/' + id,
    method: 'get'
  })
}
