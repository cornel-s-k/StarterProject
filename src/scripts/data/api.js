// src/scripts/data/api.js
import { isTokenExpired } from '../utils/token';

const BASE_URL = 'https://story-api.dicoding.dev/v1';

const API = {
  async getStories() {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      throw new Error('UNAUTHORIZED');
    }

    try {
      const response = await fetch(`${BASE_URL}/stories?location=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.error) throw new Error(data.message);
      return data.listStory;
    } catch (error) {
      console.error('Gagal fetch stories:', error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.message);
      return data.loginResult.token;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  async addStory({ title, description, lat, lng, photoBlob }) {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      throw new Error('UNAUTHORIZED');
    }

    const formData = new FormData();
    formData.append('description', description);
    if (lat && lng) {
      formData.append('lat', lat);
      formData.append('lon', lng);
    }
    formData.append('photo', photoBlob, 'story.png');

    try {
      const response = await fetch(`${BASE_URL}/stories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.error) throw new Error(data.message);
      return data;
    } catch (error) {
      console.error('Gagal menambahkan cerita:', error);
      throw error;
    }
  }
};

export default API;
