<<<<<<< HEAD
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
=======
import HomePresenter from '../presenters/home-presenter';

const HomePage = {
  render() {
    return `<div id="story-list">Memuat cerita...</div>`;
  },

  async afterRender() {
    HomePresenter.getStories({
      onSuccess: (stories) => {
        const container = document.querySelector('#story-list');
        container.innerHTML = stories.map(s => `<p>${s.title}</p>`).join('');
      },
      onError: (err) => {
        document.querySelector('#story-list').innerHTML = 'Gagal memuat data';
        console.error(err);
      },
      onUnauthorized: () => {
        alert('Sesi habis, silakan login ulang');
        window.location.hash = '/login';
      }
    });
  }
};

export default HomePage;
>>>>>>> 668ba7c5796b75f172d68a25a0c8b7daf5dbb4d9
