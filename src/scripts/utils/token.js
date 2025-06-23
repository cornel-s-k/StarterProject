// src/scripts/utils/token.js

export function isTokenExpired(token) {
    if (!token) return true;  // Jika token tidak ada, anggap expired
  
    try {
      // Pisahkan token menjadi 3 bagian dan ambil bagian Payload
      const payload = JSON.parse(atob(token.split('.')[1]));  // Decode Payload
  
      // Ambil waktu kadaluarsa token (timestamp dalam detik)
      const expirationTime = payload.exp;
  
      // Ambil waktu sekarang dalam detik
      const now = Math.floor(Date.now() / 1000);
  
      // Bandingkan waktu sekarang dengan waktu kadaluarsa token
      return expirationTime && now >= expirationTime;
    } catch (e) {
      return true;  // Jika terjadi error saat decode, anggap token expired
    }
  }
  