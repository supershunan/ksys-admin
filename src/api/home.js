/** 首页 */
import axios from '@/libs/api.request'

export const getStatisticsData = () => {
  return axios.request({
    url: '/background/index/statistic',
    method: 'get'
  })
}
