import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 🔧 Fix untuk marker icon hilang (marker-icon dan shadow)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const createMap = (containerId, center = [-6.2, 106.816666], zoom = 11) => {
  const map = L.map(containerId).setView(center, zoom);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  return map;
};

export default createMap;
