/** 金币商城 */
import axios from '@/libs/api.request'

/** 金币商城列表 */
export const getStoreListApi = (data) => {
  return axios.request({
    url: '/coinGoods/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

/** 金币商城详情 */
export const getStoreDetailApi = (id) => {
  return axios.request({
    url: `/coinGoods/info/${id}`,
    method: 'get'
  })
}

/** 金币商城添加 */
export const addStoreApi = (data) => {
  return axios.request({
    url: '/coinGoods/add',
    data: JSON.stringify(data),
    method: 'post'
  })
}

/** 金币商城修改 */
export const updateStoreApi = (data) => {
  return axios.request({
    url: '/coinGoods/update',
    data: JSON.stringify(data),
    method: 'put'
  })
}

/** 金币商城删除 */
export const delStoreApi = (data) => {
  return axios.request({
    url: '/coinGoods/del',
    data: JSON.stringify(data),
    method: 'post'
  })
}
