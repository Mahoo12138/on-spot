Component({
  data: {
    activeTab: 'all',
    applications: [
      {
        id: 1,
        name: '人民医院',
        type: '现场 · 新建',
        typeClass: 'new',
        category: 'hospital',
        icon: '🏥',
        date: '2023-10-25',
        status: 'approved',
        statusText: '已通过',
        statusClass: 'approved'
      },
      {
        id: 2,
        name: '万达广场',
        type: '分场 · 修改',
        typeClass: 'modify',
        category: 'shopping',
        icon: '🛍️',
        date: '2023-10-22',
        status: 'pending',
        statusText: '审核中',
        statusClass: 'pending'
      },
      {
        id: 3,
        name: '市第一中学',
        type: '现场 · 删除',
        typeClass: 'delete',
        category: 'school',
        icon: '🎓',
        date: '2023-10-18',
        status: 'rejected',
        statusText: '未通过',
        statusClass: 'rejected'
      },
      {
        id: 4,
        name: '中心公园南门',
        type: '分场 · 新建',
        typeClass: 'new',
        category: 'park',
        icon: '🌳',
        date: '2023-10-15',
        status: 'approved',
        statusText: '已通过',
        statusClass: 'approved'
      },
      {
        id: 5,
        name: '金融中心 A座',
        type: '分场 · 修改',
        typeClass: 'modify',
        category: 'building',
        icon: '🏢',
        date: '2023-10-10',
        status: 'approved',
        statusText: '已通过',
        statusClass: 'approved'
      }
    ]
  },
  methods: {
    goBack() {
      wx.navigateBack();
    },
    openSearch() {
      wx.showToast({
        title: '搜索功能开发中',
        icon: 'none'
      });
    },
    switchTab(e: any) {
      const tab = e.currentTarget.dataset.tab;
      this.setData({ activeTab: tab });
    },
    goToDetail(e: any) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/application-detail/application-detail?id=${id}`
      });
    },
    goToHome() {
      wx.switchTab({
        url: '/pages/venues-list/venues-list'
      });
    },
    goToSettings() {
      wx.showToast({
        title: '设置页面开发中',
        icon: 'none'
      });
    }
  }
});
