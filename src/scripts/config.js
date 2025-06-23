const CONFIG = {
  BASE_URL: 'https://story-api.dicoding.dev/v1',
  get TOKEN() {
    return `Bearer ${localStorage.getItem('token')}`;
  },
};

