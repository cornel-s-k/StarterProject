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
        window.location.href = '#/home';
      } catch (error) {
        message.textContent = `Login gagal: ${error.message}`;
      }
    });
  }
}

