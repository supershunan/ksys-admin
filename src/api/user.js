import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  let data = {
    account: userName,
    password
  }
  data = JSON.stringify(data)
  return axios.request({
    url: '/newApi/auth/login',
    data,
    method: 'post'
  })
}

export const regExpert = (data) => {
  return axios.request({
    url: '/newApi/auth/regExpert',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/newApi/auth/info',
    params: {
      token
    },
    method: 'get'
  })
}

export const getMyInfo = () => {
  return axios.request({
    url: '/newApi/user/myInfo',
    method: 'get'
  })
}

export const updateMyInfo = (data) => {
  return axios.request({
    url: '/newApi/user/updateMyInfo',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const updatePwd = (data) => {
  return axios.request({
    url: '/newApi/user/updatePwd',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const pageData = (data) => {
  return axios.request({
    url: '/newApi/user/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const delData = (data) => {
  return axios.request({
    url: '/newApi/user/del',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const banData = (id) => {
  return axios.request({
    url: '/newApi/user/ban/' + id,
    method: 'get'
  })
}

export const addUserData = (data) => {
  return axios.request({
    url: '/newApi/user/addUser',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const addPubData = (data) => {
  return axios.request({
    url: '/newApi/user/addPub',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const addExpertData = (data) => {
  return axios.request({
    url: '/newApi/user/addExpert',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const infoData = (id) => {
  return axios.request({
    url: '/newApi/user/info/' + id,
    method: 'get'
  })
}

export const updateData = (data) => {
  return axios.request({
    url: '/newApi/user/update',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const rechargeData = (data) => {
  return axios.request({
    url: '/newApi/user/recharge',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const shareUrlData = () => {
  return axios.request({
    url: '/newApi/user/shareUrl',
    method: 'get'
  })
}

export const pageEvipData = (data) => {
  return axios.request({
    url: '/newApi/user/pageEvip',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const pageVipData = (data) => {
  return axios.request({
    url: '/newApi/user/pageVip',
    data: JSON.stringify(data),
    method: 'post'
  })
}

export const pageMoneyLog = (data) => {
  return axios.request({
    url: '/newApi/moneyLog/page',
    data: JSON.stringify(data),
    method: 'post'
  })
}
