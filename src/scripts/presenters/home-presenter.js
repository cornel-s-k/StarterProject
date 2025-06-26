import API from '../data/api.js';

const HomePresenter = {
  async getStories(onUnauthorized) {
    try {
      return await API.getStories();
    } catch (error) {
      if (error.message === 'UNAUTHORIZED' && typeof onUnauthorized === 'function') {
        onUnauthorized();
      } else {
        throw error;
      }
      return [];
    }
  }
};

export default HomePresenter;
