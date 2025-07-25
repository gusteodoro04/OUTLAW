const map = L.map('map').setView([-21.7805, -45.9572], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Eventos simulados
const eventos = [
  {
    nome: "Encontro Centro",
    data: "2025-07-10",
    descricao: "Concentração na praça central com carros rebaixados e som automotivo.",
    lat: -21.7805,
    lon: -45.9572
  },
  {
    nome: "Drift Noturno",
    data: "2025-07-20",
    descricao: "Evento de drift na estrada da Serra. Entrada gratuita.",
    lat: -21.785,
    lon: -45.950
  },
  {
    nome: "Domingueira do Gol Quadrado",
    data: "2025-07-28",
    descricao: "Encontro exclusivo de Volks, com churrasco e música.",
    lat: -21.778,
    lon: -45.962
  }
];

// Adiciona marcadores no mapa
eventos.forEach(e => {
  L.marker([e.lat, e.lon]).addTo(map)
    .bindPopup(`<b>${e.nome}</b><br>${e.data}<br>${e.descricao}`);
});

// Adiciona lista de eventos abaixo do mapa
const ul = document.getElementById("eventos-lista");

eventos.forEach(e => {
  const li = document.createElement("li");
  li.innerHTML = `<strong>${e.nome}</strong> – ${e.data}<br>${e.descricao}`;
  ul.appendChild(li);
});
