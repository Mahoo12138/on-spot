Component({
  properties: {
    activeTab: {
      type: String,
      value: 'venues'
    }
  },
  methods: {
    switchTab(e: any) {
      const tab = e.currentTarget.dataset.tab;
      const tabMap: Record<string, string> = {
        'venues': '/pages/venues-list/venues-list',
        'favorites': '/pages/favorites/favorites',
        'profile': '/pages/profile/profile'
      };
      
      if (tab !== this.properties.activeTab) {
        wx.switchTab({
          url: tabMap[tab]
        });
      }
    }
  }
});
