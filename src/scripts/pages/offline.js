// src/pages/offline.js
import { initDB } from '../utils/db';

class OfflinePage {
  constructor() {
    this.db = null;
    this.init();
  }

  async init() {
    this.db = await initDB();
    this.renderOfflineData();
    this.setupEventListeners();
  }

  async renderOfflineData() {
    const restaurants = await this.db.getAll('restaurants');
    const reviews = await this.db.getAll('reviews');
    
    const container = document.getElementById('offline-data');
    container.innerHTML = `
      <h2>Offline Restaurants</h2>
      <ul>
        ${restaurants.map(restaurant => `
          <li>
            ${restaurant.name} - ${restaurant.city}
            <button class="delete-btn" data-id="${restaurant.id}">Delete</button>
          </li>
        `).join('')}
      </ul>
      
      <h2>Offline Reviews</h2>
      <ul>
        ${reviews.map(review => `
          <li>
            ${review.name}: ${review.review}
            <button class="delete-btn" data-id="${review.id}">Delete</button>
          </li>
        `).join('')}
      </ul>
    `;
  }

  setupEventListeners() {
    document.addEventListener('click', async (e) => {
      if (e.target.classList.contains('delete-btn')) {
        const id = e.target.getAttribute('data-id');
        const storeName = e.target.closest('h2').textContent.includes('Restaurants') 
          ? 'restaurants' 
          : 'reviews';
        
        await this.db.delete(storeName, id);
        this.renderOfflineData();
      }
    });
  }
}

new OfflinePage();