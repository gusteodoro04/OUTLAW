const map = L.map('map').setView([-21.7805, -45.9572], 13); // Poço Fundo

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Marcadores simulados (em breve virão do backend)
const eventos = [
  { nome: "Encontro Centro", lat: -21.7805, lon: -45.9572 },
  { nome: "Poço Sul Drift", lat: -21.7850, lon: -45.9500 }
];

eventos.forEach(e => {
  L.marker([e.lat, e.lon]).addTo(map)
    .bindPopup(`<b>${e.nome}</b>`);
});
