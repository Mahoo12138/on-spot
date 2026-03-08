Component({
  data: {
    userInfo: {
      name: '说说用户_9527',
      uid: '10009527'
    }
  },
  methods: {
    goToApplications() {
      wx.navigateTo({
        url: '/pages/applications/applications'
      });
    },
    openAgreement() {
      wx.showToast({
        title: '协议页面开发中',
        icon: 'none'
      });
    }
  }
});
