Component({
  data: {
    hasFavorites: false,
    favorites: []
  },
  methods: {
    goToVenueDetail(e: any) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/venue-detail/venue-detail?id=${id}`
      });
    }
  }
});
