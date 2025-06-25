import LoginPresenter from '../../presenters/login-presenter';

export default class LoginPage {
  async render() {
    return `
      <section class="login-section">
        <h2>Login</h2>
        <form id="loginForm">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required />
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required />
          <button type="submit">Login</button>
        </form>
        <p id="loginMessage"></p>
<<<<<<< HEAD
          <p class="login-link">Belum punya akun? <a href="https://story-api.dicoding.dev/auth/register" target="_blank">Daftar di sini</a></p>
=======
>>>>>>> 668ba7c5796b75f172d68a25a0c8b7daf5dbb4d9
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('loginForm');
    const message = document.getElementById('loginMessage');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.email.value;
      const password = form.password.value;

      try {
        await LoginPresenter.login(email, password);
        message.textContent = 'Login berhasil! Mengalihkan...';
<<<<<<< HEAD
        window.location.href = '#/home'; // Redirect to home after successful login
=======
        window.location.href = '#/home';
>>>>>>> 668ba7c5796b75f172d68a25a0c8b7daf5dbb4d9
      } catch (error) {
        message.textContent = `Login gagal: ${error.message}`;
      }
    });
  }
<<<<<<< HEAD
}
=======
}

>>>>>>> 668ba7c5796b75f172d68a25a0c8b7daf5dbb4d9
