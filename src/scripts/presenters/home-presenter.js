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
