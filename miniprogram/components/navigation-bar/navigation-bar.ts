Component({
  options: {
    multipleSlots: true
  },

  properties: {
    extClass: {
      type: String,
      value: ''
    },
    
    title: {
      type: String,
      value: ''
    },
    
    background: {
      type: String,
      value: ''
    },
    
    color: {
      type: String,
      value: ''
    },
    
    back: {
      type: Boolean,
      value: true
    },
    
    homeButton: {
      type: Boolean,
      value: false
    },
    
    delta: {
      type: Number,
      value: 1
    },
    
    loading: {
      type: Boolean,
      value: false
    },
    
    fixed: {
      type: Boolean,
      value: false
    },
    
    placeholder: {
      type: Boolean,
      value: true
    },
    
    transparent: {
      type: Boolean,
      value: false
    },
    
    blur: {
      type: Boolean,
      value: false
    }
  },

  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    menuButtonWidth: 87,
    menuButtonHeight: 32,
    menuButtonRight: 87
  },

  lifetimes: {
    attached() {
      this.getSystemInfo();
    }
  },

  methods: {
    getSystemInfo() {
      const menuButtonRect = wx.getMenuButtonBoundingClientRect();
      
      wx.getSystemInfo({
        success: (res) => {
          const statusBarHeight = res.statusBarHeight || 20;
          const screenWidth = res.screenWidth;
          
          const menuButtonWidth = menuButtonRect.width;
          const menuButtonHeight = menuButtonRect.height;
          const menuButtonTop = menuButtonRect.top;
          const menuButtonRight = screenWidth - menuButtonRect.right;
          
          const navBarHeight = menuButtonHeight + (menuButtonTop - statusBarHeight) * 2;
          
          let innerStyle = '';
          if (this.properties.background) {
            innerStyle += `background-color: ${this.properties.background};`;
          }
          if (this.properties.color) {
            innerStyle += `color: ${this.properties.color};`;
          }
          
          this.setData({
            statusBarHeight,
            navBarHeight,
            menuButtonWidth,
            menuButtonHeight,
            menuButtonRight,
            innerStyle
          });
        }
      });
    },

    handleBack() {
      this.triggerEvent('back');
      
      if (this.properties.delta > 0) {
        const pages = getCurrentPages();
        if (pages.length > 1) {
          wx.navigateBack({
            delta: this.properties.delta
          });
        } else {
          wx.switchTab({
            url: '/pages/venues-list/venues-list'
          });
        }
      }
    },

    handleHome() {
      this.triggerEvent('home');
      wx.switchTab({
        url: '/pages/venues-list/venues-list'
      });
    }
  }
});
