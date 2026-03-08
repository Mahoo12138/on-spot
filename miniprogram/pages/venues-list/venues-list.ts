Component({
  data: {
    searchText: '',
    hasVenues: true,
    venues: [
      {
        id: 1,
        name: '万达广场 (五角场店)',
        address: '上海市杨浦区五角场街道淞沪路77号',
        category: 'shopping',
        icon: '🛍️',
        postCount: 15,
        isHot: true
      },
      {
        id: 2,
        name: '华山医院',
        address: '上海市静安区乌鲁木齐中路12号',
        category: 'hospital',
        icon: '🏥',
        postCount: 8,
        isHot: true
      },
      {
        id: 3,
        name: '复旦大学 (邯郸校区)',
        address: '上海市杨浦区邯郸路220号',
        category: 'school',
        icon: '🎓',
        postCount: 3,
        isHot: false
      },
      {
        id: 4,
        name: '上海虹桥站',
        address: '上海市闵行区申贵路1500号',
        category: 'transport',
        icon: '🚄',
        postCount: 42,
        isHot: true
      },
      {
        id: 5,
        name: '世纪公园',
        address: '上海市浦东新区锦绣路1001号',
        category: 'park',
        icon: '🌳',
        postCount: 0,
        isHot: false
      }
    ]
  },
  methods: {
    goBack() {
      wx.navigateBack();
    },
    openFilter() {
      wx.showToast({
        title: '筛选功能开发中',
        icon: 'none'
      });
    },
    onSearchInput(e: any) {
      this.setData({
        searchText: e.detail.value
      });
    },
    goToVenueDetail(e: any) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/venue-detail/venue-detail?id=${id}`
      });
    },
    createVenue() {
      wx.navigateTo({
        url: '/pages/create-venue/create-venue'
      });
    }
  }
});
