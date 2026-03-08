Component({
  data: {},
  lifetimes: {
    attached() {
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/permission/permission'
        });
      }, 2000);
    }
  }
});
