import Main from '@/components/main'
import parentView from '@/components/parent-view'

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
    path: '/reg',
    name: 'reg',
    meta: {
      title: '达人入驻',
      hideInMenu: true
    },
    component: () => import('@/view/reg/reg.vue')
  },
  {
    path: '/home',
    name: '_home',
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
    path: '/userClient',
    name: '用户端',
    meta: {
      icon: 'logo-buffer',
      title: '用户端',
      access: 'my'
    },
    component: Main,
    children: [
      {
        path: 'packList',
        name: '充值套餐',
        meta: {
          icon: 'md-contact',
          title: '充值套餐', // 修改
          access: 'packList'
        },
        component: () => import('@/view/business/pack/packList.vue')
      },
      {
        path: 'moneyLog',
        name: '管理设置',
        meta: {
          icon: 'md-medal',
          title: '管理设置', // 新增
          access: 'moneyLog'
        },
        component: () => import('@/view/business/user/moneyLogList.vue')
      }
    ]
  },
  {
    path: '/celebrityClient',
    name: '达人端',
    meta: {
      icon: 'logo-buffer',
      title: '达人端',
      access: 'my'
    },
    component: Main,
    children: [
      {
        path: 'packList',
        name: '公告',
        meta: {
          icon: 'md-contact',
          title: '公告', // 新增
          access: 'packList'
        },
        component: () => import('@/view/business/pack/packList.vue')
      },
      {
        path: 'moneyLog',
        name: '教程',
        meta: {
          icon: 'md-medal',
          title: '教程', // 新增
          access: 'moneyLog'
        },
        component: () => import('@/view/business/user/moneyLogList.vue')
      },
      {
        path: 'moneyLog',
        name: '信息',
        meta: {
          icon: 'md-medal',
          title: '信息', // 新增
          access: 'moneyLog'
        },
        component: () => import('@/view/business/user/moneyLogList.vue')
      },
      {
        path: 'moneyLog',
        name: '推广详情',
        meta: {
          icon: 'md-medal',
          title: '推广详情', // 新增
          access: 'moneyLog'
        },
        component: () => import('@/view/business/user/moneyLogList.vue')
      },
      {
        path: 'moneyLog',
        name: '设置',
        meta: {
          icon: 'md-medal',
          title: '设置', // 新增
          access: 'moneyLog'
        },
        component: () => import('@/view/business/user/moneyLogList.vue')
      }
    ]
  },
  {
    path: '/userManage',
    name: '用户管理',
    meta: {
      icon: 'logo-buffer',
      title: '用户管理',
      access: 'my'
    },
    component: Main,
    children: [
      {
        path: 'userList',
        name: '用户信息',
        meta: {
          icon: 'md-contact',
          title: '用户信息',
          access: 'userList'
        },
        component: () => import('@/view/business/user/list.vue')
      },
      {
        path: 'moneyLog',
        name: '团长信息',
        meta: {
          icon: 'md-medal',
          title: '团长信息', // 新增
          access: 'moneyLog'
        },
        component: () => import('@/view/business/user/moneyLogList.vue')
      },
      {
        path: 'moneyLog',
        name: '达人信息',
        meta: {
          icon: 'md-medal',
          title: '达人信息', // 新增
          access: 'moneyLog'
        },
        component: () => import('@/view/business/user/moneyLogList.vue')
      },
      {
        path: 'vipPlat',
        name: '专属会员',
        meta: {
          icon: 'md-medal',
          title: '专属会员', // 修改
          access: 'vipPlat'
        },
        component: () => import('@/view/business/vip/vipList.vue')
      }
    ]
  },
  {
    path: '/globalManage',
    name: '全局管理',
    meta: {
      icon: 'logo-buffer',
      title: '全局管理',
      access: 'my'
    },
    component: Main,
    children: [
      {
        path: 'packList',
        name: '充值套餐',
        meta: {
          icon: 'md-contact',
          title: '充值套餐', // 修改
          access: 'packList'
        },
        component: () => import('@/view/business/pack/packList.vue')
      },
      {
        path: 'sysConfig',
        name: '会员配置',
        meta: {
          icon: 'md-medal',
          title: '会员配置', // 修改
          access: 'sysConfig'
        },
        component: () => import('@/view/business/user/sysConfig.vue')
      },
      {
        path: 'moneyLog',
        name: '流水记录',
        meta: {
          icon: 'md-medal',
          title: '流水记录',
          access: 'moneyLog'
        },
        component: () => import('@/view/business/user/moneyLogList.vue')
      }
    ]
  },
  {
    path: '/videoReview',
    name: '视频审核',
    meta: {
      icon: 'logo-buffer',
      title: '视频审核',
      access: 'my'
    },
    component: Main,
    children: [
      {
        path: 'packList',
        name: '审核视频',
        meta: {
          icon: 'md-contact',
          title: '审核视频', // 新增
          access: 'packList'
        },
        component: () => import('@/view/business/pack/packList.vue')
      },
      {
        path: 'sysConfig',
        name: '达人视频',
        meta: {
          icon: 'md-medal',
          title: '达人视频', // 新增
          access: 'sysConfig'
        },
        component: () => import('@/view/business/user/sysConfig.vue')
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
        name: 'home',
        meta: {
          title: '素材库', // 新增
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/financialManage',
    name: '财务管理',
    meta: {
      icon: 'logo-buffer',
      title: '财务管理',
      access: 'my'
    },
    component: Main,
    children: [
      {
        path: 'packList',
        name: '对账信息',
        meta: {
          icon: 'md-contact',
          title: '对账信息', // 新增
          access: 'packList'
        },
        component: () => import('@/view/business/pack/packList.vue')
      },
      {
        path: 'sysConfig',
        name: '提现信息',
        meta: {
          icon: 'md-medal',
          title: '提现信息', // 新增
          access: 'sysConfig'
        },
        component: () => import('@/view/business/user/sysConfig.vue')
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
        component: () => import('@/view/business/user/sysConfig.vue')
      }
    ]
  },
  // {
  //   path: '',
  //   name: 'doc',
  //   meta: {
  //     title: '文档',
  //     href: 'https://lison16.github.io/iview-admin-doc/#/',
  //     icon: 'ios-book'
  //   }
  // },
  // {
  //   path: '/join',
  //   name: 'join',
  //   component: Main,
  //   meta: {
  //     hideInBread: true
  //   },
  //   children: [
  //     {
  //       path: 'join_page',
  //       name: 'join_page',
  //       meta: {
  //         icon: '_qq',
  //         title: 'QQ群'
  //       },
  //       component: () => import('@/view/join-page.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/message',
  //   name: 'message',
  //   component: Main,
  //   meta: {
  //     hideInBread: true,
  //     hideInMenu: true
  //   },
  //   children: [
  //     {
  //       path: 'message_page',
  //       name: 'message_page',
  //       meta: {
  //         icon: 'md-notifications',
  //         title: '消息中心'
  //       },
  //       component: () => import('@/view/single-page/message/index.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/components',
  //   name: 'components',
  //   meta: {
  //     icon: 'logo-buffer',
  //     title: '组件'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'tree_select_page',
  //       name: 'tree_select_page',
  //       meta: {
  //         icon: 'md-arrow-dropdown-circle',
  //         title: '树状下拉选择器'
  //       },
  //       component: () => import('@/view/components/tree-select/index.vue')
  //     },
  //     {
  //       path: 'count_to_page',
  //       name: 'count_to_page',
  //       meta: {
  //         icon: 'md-trending-up',
  //         title: '数字渐变'
  //       },
  //       component: () => import('@/view/components/count-to/count-to.vue')
  //     },
  //     {
  //       path: 'drag_list_page',
  //       name: 'drag_list_page',
  //       meta: {
  //         icon: 'ios-infinite',
  //         title: '拖拽列表'
  //       },
  //       component: () => import('@/view/components/drag-list/drag-list.vue')
  //     },
  //     {
  //       path: 'drag_drawer_page',
  //       name: 'drag_drawer_page',
  //       meta: {
  //         icon: 'md-list',
  //         title: '可拖拽抽屉'
  //       },
  //       component: () => import('@/view/components/drag-drawer')
  //     },
  //     {
  //       path: 'org_tree_page',
  //       name: 'org_tree_page',
  //       meta: {
  //         icon: 'ios-people',
  //         title: '组织结构树'
  //       },
  //       component: () => import('@/view/components/org-tree')
  //     },
  //     {
  //       path: 'tree_table_page',
  //       name: 'tree_table_page',
  //       meta: {
  //         icon: 'md-git-branch',
  //         title: '树状表格'
  //       },
  //       component: () => import('@/view/components/tree-table/index.vue')
  //     },
  //     {
  //       path: 'cropper_page',
  //       name: 'cropper_page',
  //       meta: {
  //         icon: 'md-crop',
  //         title: '图片裁剪'
  //       },
  //       component: () => import('@/view/components/cropper/cropper.vue')
  //     },
  //     {
  //       path: 'tables_page',
  //       name: 'tables_page',
  //       meta: {
  //         icon: 'md-grid',
  //         title: '多功能表格'
  //       },
  //       component: () => import('@/view/components/tables/tables.vue')
  //     },
  //     {
  //       path: 'split_pane_page',
  //       name: 'split_pane_page',
  //       meta: {
  //         icon: 'md-pause',
  //         title: '分割窗口'
  //       },
  //       component: () => import('@/view/components/split-pane/split-pane.vue')
  //     },
  //     {
  //       path: 'markdown_page',
  //       name: 'markdown_page',
  //       meta: {
  //         icon: 'logo-markdown',
  //         title: 'Markdown编辑器'
  //       },
  //       component: () => import('@/view/components/markdown/markdown.vue')
  //     },
  //     {
  //       path: 'editor_page',
  //       name: 'editor_page',
  //       meta: {
  //         icon: 'ios-create',
  //         title: '富文本编辑器'
  //       },
  //       component: () => import('@/view/components/editor/editor.vue')
  //     },
  //     {
  //       path: 'icons_page',
  //       name: 'icons_page',
  //       meta: {
  //         icon: '_bear',
  //         title: '自定义图标'
  //       },
  //       component: () => import('@/view/components/icons/icons.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/update',
  //   name: 'update',
  //   meta: {
  //     icon: 'md-cloud-upload',
  //     title: '数据上传'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'update_table_page',
  //       name: 'update_table_page',
  //       meta: {
  //         icon: 'ios-document',
  //         title: '上传Csv'
  //       },
  //       component: () => import('@/view/update/update-table.vue')
  //     },
  //     {
  //       path: 'update_paste_page',
  //       name: 'update_paste_page',
  //       meta: {
  //         icon: 'md-clipboard',
  //         title: '粘贴表格数据'
  //       },
  //       component: () => import('@/view/update/update-paste.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/excel',
  //   name: 'excel',
  //   meta: {
  //     icon: 'ios-stats',
  //     title: 'EXCEL导入导出'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'upload-excel',
  //       name: 'upload-excel',
  //       meta: {
  //         icon: 'md-add',
  //         title: '导入EXCEL'
  //       },
  //       component: () => import('@/view/excel/upload-excel.vue')
  //     },
  //     {
  //       path: 'export-excel',
  //       name: 'export-excel',
  //       meta: {
  //         icon: 'md-download',
  //         title: '导出EXCEL'
  //       },
  //       component: () => import('@/view/excel/export-excel.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/tools_methods',
  //   name: 'tools_methods',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'tools_methods_page',
  //       name: 'tools_methods_page',
  //       meta: {
  //         icon: 'ios-hammer',
  //         title: '工具方法',
  //         beforeCloseName: 'before_close_normal'
  //       },
  //       component: () => import('@/view/tools-methods/tools-methods.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/i18n',
  //   name: 'i18n',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'i18n_page',
  //       name: 'i18n_page',
  //       meta: {
  //         icon: 'md-planet',
  //         title: 'i18n - {{ i18n_page }}'
  //       },
  //       component: () => import('@/view/i18n/i18n-page.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/error_store',
  //   name: 'error_store',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'error_store_page',
  //       name: 'error_store_page',
  //       meta: {
  //         icon: 'ios-bug',
  //         title: '错误收集'
  //       },
  //       component: () => import('@/view/error-store/error-store.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/error_logger',
  //   name: 'error_logger',
  //   meta: {
  //     hideInBread: true,
  //     hideInMenu: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'error_logger_page',
  //       name: 'error_logger_page',
  //       meta: {
  //         icon: 'ios-bug',
  //         title: '错误收集'
  //       },
  //       component: () => import('@/view/single-page/error-logger.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/directive',
  //   name: 'directive',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'directive_page',
  //       name: 'directive_page',
  //       meta: {
  //         icon: 'ios-navigate',
  //         title: '指令'
  //       },
  //       component: () => import('@/view/directive/directive.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/multilevel',
  //   name: 'multilevel',
  //   meta: {
  //     icon: 'md-menu',
  //     title: '多级菜单'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'level_2_1',
  //       name: 'level_2_1',
  //       meta: {
  //         icon: 'md-funnel',
  //         title: '二级-1'
  //       },
  //       component: () => import('@/view/multilevel/level-2-1.vue')
  //     },
  //     {
  //       path: 'level_2_2',
  //       name: 'level_2_2',
  //       meta: {
  //         access: ['super_admin'],
  //         icon: 'md-funnel',
  //         showAlways: true,
  //         title: '二级-2'
  //       },
  //       component: parentView,
  //       children: [
  //         {
  //           path: 'level_2_2_1',
  //           name: 'level_2_2_1',
  //           meta: {
  //             icon: 'md-funnel',
  //             title: '三级'
  //           },
  //           component: () => import('@/view/multilevel/level-2-2/level-2-2-1.vue')
  //         },
  //         {
  //           path: 'level_2_2_2',
  //           name: 'level_2_2_2',
  //           meta: {
  //             icon: 'md-funnel',
  //             title: '三级'
  //           },
  //           component: () => import('@/view/multilevel/level-2-2/level-2-2-2.vue')
  //         }
  //       ]
  //     },
  //     {
  //       path: 'level_2_3',
  //       name: 'level_2_3',
  //       meta: {
  //         icon: 'md-funnel',
  //         title: '二级-3'
  //       },
  //       component: () => import('@/view/multilevel/level-2-3.vue')
  //     }
  //   ]
  // },
  {
    path: '/pack',
    name: '套餐管理',
    meta: {
      icon: 'logo-buffer',
      title: '套餐管理',
      access: 'pack'
    },
    component: Main,
    children: [
      {
        path: 'packList',
        name: '套餐信息',
        meta: {
          icon: 'md-contact',
          title: '套餐信息',
          access: 'packList'
        },
        component: () => import('@/view/business/pack/packList.vue')
      }
    ]
  },
  {
    path: '/works',
    name: '作品管理',
    meta: {
      icon: 'logo-buffer',
      title: '作品管理',
      access: 'works'
    },
    component: Main,
    children: [
      {
        path: 'worksList',
        name: '作品信息',
        meta: {
          icon: 'md-contact',
          title: '作品信息',
          access: 'worksList'
        },
        component: () => import('@/view/business/works/worksList.vue')
      }
    ]
  },
  {
    path: '/order',
    name: '订单管理',
    meta: {
      icon: 'logo-buffer',
      title: '订单管理',
      access: 'order'
    },
    component: Main,
    children: [
      {
        path: 'orderList',
        name: '订单数据',
        meta: {
          icon: 'md-contact',
          title: '订单数据',
          access: 'orderList'
        },
        component: () => import('@/view/business/order/orderList.vue')
      }
    ]
  },
  {
    path: '/apply',
    name: '审核管理',
    meta: {
      icon: 'logo-buffer',
      title: '审核管理',
      access: 'apply'
    },
    component: Main,
    children: [
      {
        path: 'applyList',
        name: '审核数据',
        meta: {
          icon: 'md-contact',
          title: '审核数据',
          access: 'applyList'
        },
        component: () => import('@/view/business/apply/applyList.vue')
      }
    ]
  },
  {
    path: '/vip',
    name: '会员服务',
    meta: {
      icon: 'logo-buffer',
      title: '会员服务',
      access: 'vip'
    },
    component: Main,
    children: [
      {
        path: 'vipExpert',
        name: '专属会员',
        meta: {
          icon: 'md-contact',
          title: '专属会员',
          access: 'vipExpert'
        },
        component: () => import('@/view/business/vip/evipList.vue')
      },
      {
        path: 'vipPlat',
        name: '平台会员',
        meta: {
          icon: 'md-medal',
          title: '平台会员',
          access: 'vipPlat'
        },
        component: () => import('@/view/business/vip/vipList.vue')
      }
    ]
  },
  {
    path: '/user',
    name: '用户管理',
    meta: {
      icon: 'logo-buffer',
      title: '用户管理',
      access: 'user'
    },
    component: Main,
    children: [
      {
        path: 'userList',
        name: '用户数据',
        meta: {
          icon: 'md-contact',
          title: '用户数据',
          access: 'userList'
        },
        component: () => import('@/view/business/user/list.vue')
      },
      {
        path: 'expertList',
        name: '达人管理',
        meta: {
          icon: 'md-medal',
          title: '达人管理',
          access: 'expertList'
        },
        component: () => import('@/view/business/user/expertList.vue')
      },
      {
        path: 'pubList',
        name: '推广人员',
        meta: {
          icon: 'md-medal',
          title: '推广人员',
          access: 'pubList'
        },
        component: () => import('@/view/business/user/pubList.vue')
      }
    ]
  },
  {
    path: '/my',
    name: '个人中心',
    meta: {
      icon: 'logo-buffer',
      title: '个人中心',
      access: 'my'
    },
    component: Main,
    children: [
      {
        path: 'myInfo',
        name: '我的信息',
        meta: {
          icon: 'md-contact',
          title: '我的信息',
          access: 'myInfo'
        },
        component: () => import('@/view/business/user/myInfo.vue')
      },
      {
        path: 'moneyLog',
        name: '流水记录',
        meta: {
          icon: 'md-medal',
          title: '流水记录',
          access: 'moneyLog'
        },
        component: () => import('@/view/business/user/moneyLogList.vue')
      },
      {
        path: 'miniConfig',
        name: '小程序配置',
        meta: {
          icon: 'md-medal',
          title: '小程序配置',
          access: 'miniConfig'
        },
        component: () => import('@/view/business/user/miniConfig.vue')
      },
      {
        path: 'sysConfig',
        name: '系统设置',
        meta: {
          icon: 'md-medal',
          title: '系统设置',
          access: 'sysConfig'
        },
        component: () => import('@/view/business/user/sysConfig.vue')
      }
    ]
  },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`,
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
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
