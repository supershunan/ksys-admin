import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: 'home',
    redirect: '/home',
    component: Main,
    meta: {
      icon: 'logo-buffer',
      title: '首页'
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '首页', // 修改
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/manageSetting',
    name: '管理设置',
    redirect: '/manageSetting',
    meta: {
      icon: 'logo-buffer',
      title: '管理设置'
    },
    component: Main,
    children: [
      {
        path: '/manageSetting',
        name: '管理设置',
        meta: {
          icon: 'md-medal',
          title: '管理设置'
        },
        component: () => import('@/view/userClient/manageSetting/index.vue')
      }
    ]
  },
  {
    path: '/celebrityClient',
    name: '达人端',
    meta: {
      icon: 'logo-buffer',
      title: '达人端'
    },
    component: Main,
    children: [
      {
        path: '/notice',
        name: '公告',
        meta: {
          icon: 'md-contact',
          title: '公告'
        },
        component: () => import('@/view/expertEnd/notice/index.vue')
      },
      {
        path: '/tutorial',
        name: '教程',
        meta: {
          icon: 'md-medal',
          title: '教程'
        },
        component: () => import('@/view/expertEnd/tutorial/index.vue')
      },
      {
        path: '/information',
        name: '信息',
        meta: {
          icon: 'md-medal',
          title: '信息'
        },
        component: () => import('@/view/expertEnd/information/index.vue')
      },
      {
        path: '/promotiondetails',
        name: '推广详情',
        meta: {
          icon: 'md-medal',
          title: '推广详情'
        },
        component: () => import('@/view/expertEnd/promotiondetails/index.vue')
      },
      {
        path: '/setUp',
        name: '设置',
        meta: {
          icon: 'md-medal',
          title: '设置'
        },
        component: () => import('@/view/expertEnd/setUp/index.vue')
      },
      {
        path: '/initSetting',
        name: 'markdown配置',
        meta: {
          icon: 'md-medal',
          title: 'markdown配置'
        },
        component: () => import('@/view/expertEnd/markdownSetting/index.vue')
      }
    ]
  },
  {
    path: '/userManage',
    name: '用户管理',
    meta: {
      icon: 'logo-buffer',
      title: '用户管理'
    },
    component: Main,
    children: [
      {
        path: '/userInformation',
        name: '用户信息',
        meta: {
          icon: 'md-contact',
          title: '用户信息'
        },
        component: () => import('@/view/userManage/userInformation/index.vue')
      },
      {
        path: '/leaderInformation',
        name: '团长信息',
        meta: {
          icon: 'md-medal',
          title: '团长信息'
        },
        component: () => import('@/view/userManage/leaderInformation/index.vue')
      },
      {
        path: '/expertInformation',
        name: '达人信息',
        meta: {
          icon: 'md-medal',
          title: '达人信息'
        },
        component: () => import('@/view/userManage/expertInformation/index.vue')
      },
      {
        path: '/exclusiveMembership',
        name: '专属会员',
        meta: {
          icon: 'md-medal',
          title: '专属会员' // 修改
        },
        component: () => import('@/view/userManage/exclusiveMembership/index.vue')
      }
    ]
  },
  {
    path: '/globalManage',
    name: '全局管理',
    meta: {
      icon: 'logo-buffer',
      title: '全局管理'
    },
    component: Main,
    children: [
      {
        path: '/packList',
        name: '充值套餐',
        meta: {
          icon: 'md-contact',
          title: '充值套餐' // 修改
        },
        component: () => import('@/view/globalManage/packList/index.vue')
      },
      {
        path: '/membershipSetting',
        name: '会员配置',
        meta: {
          icon: 'md-medal',
          title: '会员配置' // 修改
        },
        component: () => import('@/view/globalManage/membershipSetting/index.vue')
      },
      {
        path: '/flowRecord',
        name: '流水记录',
        meta: {
          icon: 'md-medal',
          title: '流水记录'
        },
        component: () => import('@/view/globalManage/flowRecord/index.vue')
      }
    ]
  },
  {
    path: '/videoReview',
    name: '视频审核',
    meta: {
      icon: 'logo-buffer',
      title: '视频审核'
    },
    component: Main,
    children: [
      {
        path: '/reviewVideo',
        name: '审核视频',
        meta: {
          icon: 'md-contact',
          title: '审核视频'
        },
        component: () => import('@/view/videoReview/reviewVideo/index.vue')
      },
      {
        path: '/expertVideo',
        name: '达人视频',
        meta: {
          icon: 'md-medal',
          title: '达人视频'
        },
        component: () => import('@/view/videoReview/expertVideo/index.vue')
      },
      {
        path: '/expertVideoDetail',
        name: 'expertVideoDetail',
        meta: {
          icon: 'md-medal',
          title: '达人视频详情',
          hideInMenu: true
        },
        component: () => import('@/view/videoReview/expertVideo/manageVideo.vue')
      }
    ]
  },
  {
    path: '/materialLibrary',
    name: '_home',
    redirect: '/materialLibrary',
    component: Main,
    meta: {
      icon: 'logo-buffer',
      title: '素材库'
    },
    children: [
      {
        path: '/materialLibrary',
        name: 'materialLibrary',
        meta: {
          title: '素材库',
          icon: 'md-home'
        },
        component: () => import('@/view/materialLibrary/index.vue')
      }
    ]
  },
  {
    path: '/financialManage',
    name: '财务管理',
    meta: {
      icon: 'logo-buffer',
      title: '财务管理'
    },
    component: Main,
    children: [
      {
        path: '/reconciliationInformation',
        name: '对账信息',
        meta: {
          icon: 'md-contact',
          title: '对账信息'
        },
        component: () => import('@/view/financialManage/reconciliationInformation/index.vue')
      },
      {
        path: '/withdrawalInformation',
        name: '提现信息',
        meta: {
          icon: 'md-medal',
          title: '提现信息'
        },
        component: () => import('@/view/financialManage/withdrawalInformation/index.vue')
      }
    ]
  },
  {
    path: '/sysConfig',
    name: '_sysConfig',
    redirect: '/sysConfig',
    component: Main,
    meta: {
      icon: 'logo-buffer',
      title: '设置'
    },
    children: [
      {
        path: '/sysConfig',
        name: 'sysConfig',
        meta: {
          title: '设置', // 修改
          icon: 'md-home'
        },
        component: () => import('@/view/setting/index.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
