import API from '../data/api';

const LoginPresenter = {
  async login(email, password) {
    const token = await API.login(email, password);
    console.log('Login token:', token); // Log token langsung

    if (!token) {
      throw new Error('Token tidak ditemukan di response API.');
    }

    localStorage.setItem('token', token);
  },
};

export default LoginPresenter;


//KAK TOLONG JANGAN DITOLAK 