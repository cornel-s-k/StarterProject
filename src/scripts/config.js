const CONFIG = {
  BASE_URL: 'https://story-api.dicoding.dev/v1',
  get TOKEN() {
    return `Bearer ${localStorage.getItem('token')}`;
  },
  VAPID_PUBLIC_KEY: 'BDytrDGHBq8XfBf8X_GE5vL4diRflMEhqxO2kgIDp_GwwuOJNZpy2Tj5KCR6cP5TVvzvZJ_rtcqL6nxYQYGba7g', // ADD THIS LINE
};

export default CONFIG;