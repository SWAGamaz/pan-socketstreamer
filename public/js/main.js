// MAPBOX

// Init mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoic3dhZ2FtYXoiLCJhIjoiY2tybTJ0eTMwNDM5YzJ1cDhpeTAxN2JjcyJ9.pEQ0T65r0k17Gbl2-2L2nw';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/swagamaz/cl398sug9000114lln34sav9r',
  center: [30.270915, 59.936545],
  zoom: 11.27
});

// Init Markers
const geojson = {
  type: 'FeatureCollection',
  "features": [
    {  // Крепость
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          30.316124,
          59.950119
        ],
        "type": "Point"
      },
      "id": "fe2be63295ba898fb9a9cc753fc7274b"
    },
    {  // Арена
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          30.220348,
          59.973042
        ],
        "type": "Point"
      },
      "id": "82c2cdad6bcee5d3a057d7bc9672f710"
    },
    {  // Вантовый мост
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          30.216432,
          59.966498
        ],
        "type": "Point"
      },
      "id": "c2a0e3187447ccf9fbb2d03cc90eb0c4"
    },
    {  // Двойной мост
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          30.208264,
          59.905688
        ],
        "type": "Point"
      },
      "id": "85498664460343cb44d9f380c6d4f0de"
    },
    {  // Михайловский замок
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          30.337600,
          59.940735
        ],
        "type": "Point"
      },
      "id": "a526940dc234c4ebe07aead11750a7c3"
    },
    {  // Казанский собор
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          30.324465,
          59.934200
        ],
        "type": "Point"
      },
      "id": "85498664460343cb44d9f380c6d4f0de"
    },
    {  // Исаакиевский собор
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          30.306274,
          59.934073
        ],
        "type": "Point"
      },
      "id": "85498664460343cb44d9f380c6d4f0de"
    },
    {  // Адмиралтейство
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          30.307693,
          59.938067
        ],
        "type": "Point"
      },
      "id": "85498664460343cb44d9f380c6d4f0de"
    },
    {  // Лахта
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          30.178022,
          59.987010
        ],
        "type": "Point"
      },
      "id": "85498664460343cb44d9f380c6d4f0de"
    }
  ]
};

// add markers to map
for (var i = 0; i < geojson.features.length; i++) {
  // create a HTML element for each feature
  const el = document.createElement('div');
  el.className = 'marker';
  el.setAttribute('marker-reference-id', i);
  el.addEventListener('click', function (ev){
    var id = ev.target.getAttribute('marker-reference-id');
    if (id) ActivePageById(id);
  }, false);
  
  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el).setLngLat(
    geojson.features[i].geometry.coordinates).addTo(map);
}

var btnMap = document.getElementById("btnMap");

btnMap.addEventListener('click', function(ev){
  map._container.classList.toggle("hide-map");
}, false);

map._container.classList.add("hide-map");

// MAPBOX END

// Controls
var scrollContainer = document.getElementById("scroll-sections");
var prevNav = document.getElementById("prev-page-navlink");
var nextNav = document.getElementById("next-page-navlink");
var allNavLinks = document.querySelectorAll('a[page-reference-navlink]');
var allPagesContent = document.querySelectorAll('div[page-content]');

window.onresize = SetPositionByViewSize;
allPagesContent[0].querySelector('video').play();

var idActiveNav = 0;
map._markers[idActiveNav]._element.classList.add("pulse");

function SetPositionByViewSize(){
  if (document.body.clientWidth <= 768)
  {
    scrollContainer.style.transform =
      'translateY(calc('+(idActiveNav * 100) + 'vh - (' + idActiveNav +' * 5rem)))';
  }
  else
  {
    scrollContainer.style.transform =
      'translateY('+(idActiveNav * -100) + 'vh)';
  }
}

function ActivePageById(idPage){
  if (idPage == idActiveNav) return;
  if (idPage >= allPagesContent.length || idPage < 0) return;
  
  allNavLinks[idActiveNav].classList.remove("isactive");
  allNavLinks[idPage].classList.add("isactive");
  allPagesContent[idActiveNav].querySelector('video').pause();
  allPagesContent[idPage].querySelector('video').play();
  // map
  map._markers[idActiveNav]._element.classList.remove("pulse");
  map._markers[idPage]._element.classList.add("pulse");
  
  idActiveNav = idPage;
  SetPositionByViewSize();
}

function NextPage(){
  ActivePageById(((1 + idActiveNav) % scrollContainer.childElementCount));
}

function PrevPage(){
  ActivePageById(
    (idActiveNav <= 0) ?
    scrollContainer.childElementCount - 1 :
    idActiveNav - 1);
}

nextNav.addEventListener('click', NextPage, false);
prevNav.addEventListener('click', PrevPage, false);

for (var i = 0; i < allNavLinks.length; i++) {
  allNavLinks[i].addEventListener('click', function (ev){
    var id = ev.target.getAttribute('page-reference-navlink');
    if (id) ActivePageById(id);
  }, false);
}

// Tooltip enable

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
});

// Controls end

// Hide Map
setTimeout(function(){
  map._container.style.transition = "all 0.8s ease";
}, 10);

