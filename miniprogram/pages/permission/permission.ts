Component({
  data: {},
  methods: {
    requestLocation() {
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          wx.switchTab({
            url: '/pages/venues-list/venues-list'
          });
        },
        fail: () => {
          wx.showModal({
            title: '提示',
            content: '请在设置中开启位置权限',
            confirmText: '去设置',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.openSetting();
              }
            }
          });
        }
      });
    },
    skipPermission() {
      wx.switchTab({
        url: '/pages/venues-list/venues-list'
      });
    },
    goToLogin() {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    },
    skipLogin() {
      wx.switchTab({
        url: '/pages/venues-list/venues-list'
      });
    }
  }
});
