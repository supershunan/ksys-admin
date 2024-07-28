<template>
    <div style="height: 100%;">
        <Tabs value="name1">
            <TabPane label="图片" name="name1">
                <div class="content">
                    <div class="left-content">
                        <Button type="primary">添加分组</Button>
                        <Card style="min-width: 300px; margin-top: 10px;">
                            <div class="group-item" v-for="group in groupNames" :key="group.key">
                                <div class="item-name">
                                    <Icon type="ios-paper-outline" />
                                    <span style="margin-left: 10px;">{{ group.name }}</span>
                                </div>
                                <div class="item-action">
                                    <span class="item-edit" @click="groupEdit">编辑</span>
                                    <Divider type="vertical" />
                                    <span class="item-delete" @click="groupDelete">删除</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div class="right-content">
                        <div class="right-content-top">
                            <div class="group-title">全部</div>
                            <div class="right-action">
                                <div>
                                    <Input search enter-button placeholder="请输入名称搜索" />
                                </div>
                                <Button type="primary" style="margin: 0 10px;">删除</Button>
                                <Dropdown trigger="click">
                                    <a href="javascript:void(0)">
                                        移动至
                                        <Icon type="ios-arrow-down"></Icon>
                                    </a>
                                    <DropdownMenu slot="list">
                                        <DropdownItem v-for="group in groupNames" :key="group.key">{{ group.name }}</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>
                        <Card style="margin-top: 10px;">

                        </Card>
                    </div>
                </div>
            </TabPane>
            <TabPane label="视频" name="name2">标签二的内容</TabPane>
        </Tabs>
    </div>
</template>

<script>
export default {
  data () {
    return {
      groupNames: [
        {
          key: 0,
          name: '全部'
        },
        {
          key: 1,
          name: '广告页'
        },
        {
          key: 2,
          name: '图标'
        },
        {
          key: 3,
          name: '个人中心'
        }
      ]
    }
  },
  methods: {
    groupEdit () {

    },
    groupDelete () {

    }
  }
}
</script>

<style lang="less" scoped>
.content {
    display: flex;
    .left-content {
        .group-item {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            .item-name {
                display: flex;
                align-items: center;
                cursor: pointer;
            }
            .item-action {
                user-select: none;
                .item-edit {
                    cursor: pointer;
                    color: #2d8cf0;
                }
                .item-edit:hover {
                    color: #0973e5;
                }
                .item-edit:active {
                    color: #004691;
                }
                .item-delete {
                    cursor: pointer;
                    color: #2d8cf0;
                }
                .item-delete:hover {
                    color: #0973e5;
                }
                .item-delete:active {
                    color: #004691;
                }
            }
        }
        .group-item:nth-child(1) {
            margin-top: 0;
        }
    }
    .right-content {
        flex: 1;
        margin-left: 10px;
        .right-content-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .right-action {
                display: flex;
                align-items: center;
            }
        }
    }
}
</style>
