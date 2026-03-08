Component({
  data: {
    applicationId: ''
  },
  lifetimes: {
    attached() {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const options = currentPage.options || {};
      this.setData({
        applicationId: options.id
      });
    }
  },
  methods: {
    goBack() {
      wx.navigateBack();
    },
    withdrawApplication() {
      wx.showModal({
        title: '确认撤回',
        content: '撤回后您可以重新编辑并再次提交申请',
        confirmText: '确认撤回',
        confirmColor: '#ef4444',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: '已撤回申请',
              icon: 'success'
            });
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          }
        }
      });
    }
  }
});
