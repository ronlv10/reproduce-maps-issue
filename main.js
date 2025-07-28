import { MarkerClusterer } from "@googlemaps/markerclusterer";

let map;
let markerCluster;
let markers = [];
let heatmap;
let infoWindow;
let currentMarkerCount = 5000;

const markerTypes = [
  { type: "restaurant", name: "Restaurant", icon: "🍽️", color: "#FF6B6B" },
  { type: "hotel", name: "Hotel", icon: "🏨", color: "#4ECDC4" },
  { type: "shop", name: "Shop", icon: "🛍️", color: "#45B7D1" },
  { type: "hospital", name: "Hospital", icon: "🏥", color: "#96CEB4" },
  { type: "school", name: "School", icon: "🏫", color: "#FFEAA7" },
];

const businessNames = {
  restaurant: [
    "Tasty Bites",
    "Golden Spoon",
    "Urban Kitchen",
    "Cafe Delight",
    "Spice Garden",
    "The Local Eatery",
    "Fusion Flavors",
    "Coastal Cuisine",
  ],
  hotel: [
    "Grand Plaza",
    "Comfort Inn",
    "Luxury Suites",
    "Budget Lodge",
    "City Center Hotel",
    "Boutique Stays",
    "Executive Rooms",
    "Travelers Rest",
  ],
  shop: [
    "Fashion Forward",
    "Tech Hub",
    "Book Corner",
    "Sports Gear",
    "Home Essentials",
    "Artisan Crafts",
    "Electronics Plus",
    "Style Station",
  ],
  hospital: [
    "General Hospital",
    "Medical Center",
    "Emergency Care",
    "Specialty Clinic",
    "Family Health",
    "Urgent Care",
    "Wellness Center",
    "Community Hospital",
  ],
  school: [
    "Elementary School",
    "High School",
    "Community College",
    "Learning Center",
    "Education Academy",
    "Knowledge Institute",
    "Study Hub",
    "Academic Center",
  ],
};

function initMap() {
  // Initialize map centered on New York City
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
    center: { lat: 40.7128, lng: -74.006 },
    styles: [
      {
        featureType: "all",
        elementType: "geometry.fill",
        stylers: [{ weight: "2.00" }],
      },
      {
        featureType: "all",
        elementType: "geometry.stroke",
        stylers: [{ color: "#9c9c9c" }],
      },
      {
        featureType: "all",
        elementType: "labels.text",
        stylers: [{ visibility: "on" }],
      },
      {
        featureType: "landscape",
        elementType: "all",
        stylers: [{ color: "#f2f2f2" }],
      },
      {
        featureType: "landscape",
        elementType: "geometry.fill",
        stylers: [{ color: "#ffffff" }],
      },
      {
        featureType: "landscape.man_made",
        elementType: "geometry.fill",
        stylers: [{ color: "#ffffff" }],
      },
      {
        featureType: "poi",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road",
        elementType: "all",
        stylers: [{ saturation: -100 }, { lightness: 45 }],
      },
      {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [{ color: "#eeeeee" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#7b7b7b" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#ffffff" }],
      },
      {
        featureType: "road.highway",
        elementType: "all",
        stylers: [{ visibility: "simplified" }],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [{ color: "#46bcec" }, { visibility: "on" }],
      },
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [{ color: "#c8d7d4" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#070707" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#ffffff" }],
      },
    ],
  });

  infoWindow = new google.maps.InfoWindow();

  // Initialize map click handler for mobile menu
  initMapClickHandler();

  document.getElementById("markerCount").addEventListener("input", function () {
    currentMarkerCount = parseInt(this.value);
    document.getElementById("markerCountValue").textContent =
      currentMarkerCount.toLocaleString() + " markers";
  });

  // Generate initial markers
  generateMarkers();
}

function generateMarkers() {
  const loadingElement = document.getElementById("loading");
  document.getElementById(
    "loadingText"
  ).textContent = `Generating ${currentMarkerCount.toLocaleString()} markers...`;
  loadingElement.style.display = "block";

  // Clear existing markers
  if (markerCluster) {
    markerCluster.clearMarkers();
  }
  markers = [];

  // Generate markers around NYC area
  const center = { lat: 40.7128, lng: -74.006 };
  const radius = 0.5; // About 50km radius

  setTimeout(() => {
    for (let i = 0; i < currentMarkerCount; i++) {
      // Random position within radius
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * radius;
      const lat = center.lat + distance * Math.cos(angle);
      const lng = center.lng + distance * Math.sin(angle);

      // Random marker type
      const markerType =
        markerTypes[Math.floor(Math.random() * markerTypes.length)];
      const businessName =
        businessNames[markerType.type][
          Math.floor(Math.random() * businessNames[markerType.type].length)
        ];

      // Create advanced marker
      const markerElement = document.createElement("div");
      markerElement.style.cssText = `
                width: 80px;
                height: 80px;
                background: ${markerType.color};
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                cursor: pointer;
                transition: transform 0.2s ease;
            `;
      markerElement.innerHTML = markerType.icon;

      // Hover effect
      markerElement.addEventListener("mouseenter", () => {
        markerElement.style.transform = "scale(1.2)";
      });
      markerElement.addEventListener("mouseleave", () => {
        markerElement.style.transform = "scale(1)";
      });

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat, lng },
        map: map,
        content: markerElement,
        title: businessName,
      });

      // Add marker data
      marker.markerType = markerType.type;
      marker.businessName = businessName;
      marker.rating = (Math.random() * 4 + 1).toFixed(1);
      marker.reviews = Math.floor(Math.random() * 500 + 10);
      marker.price = "$".repeat(Math.floor(Math.random() * 4) + 1);

      // Add click event
      marker.addListener("click", () => {
        showMarkerInfo(marker);
      });

      markers.push(marker);
    }

    // Initialize clustering
    markerCluster = new MarkerClusterer({
      map,
      markers: markers,
      renderer: {
        render: ({ count, position }) => {
          const color =
            count > 100 ? "#FF6B6B" : count > 50 ? "#4ECDC4" : "#45B7D1";
          const size = count > 100 ? 70 : count > 50 ? 60 : 50;

          return new google.maps.marker.AdvancedMarkerElement({
            position,
            content: createClusterIcon(count, color, size),
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          });
        },
      },
    });

    // Initialize heatmap data
    initHeatmap();

    document.getElementById("loading").style.display = "none";
    updateStats();
  }, 100);
}

function createClusterIcon(count, color, size) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.setAttribute("cx", size / 2);
  circle.setAttribute("cy", size / 2);
  circle.setAttribute("r", size / 2 - 2);
  circle.setAttribute("fill", color);
  circle.setAttribute("stroke", "white");
  circle.setAttribute("stroke-width", "3");
  circle.setAttribute("opacity", "0.9");

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", size / 2);
  text.setAttribute("y", size / 2);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "central");
  text.setAttribute("fill", "white");
  text.setAttribute("font-size", size > 50 ? "14" : "12");
  text.setAttribute("font-weight", "bold");
  text.textContent = count;

  svg.appendChild(circle);
  svg.appendChild(text);

  return svg;
}

function showMarkerInfo(marker) {
  const content = `
        <div style="max-width: 300px;">
            <h3 style="margin: 0 0 10px 0; color: #333;">${
              marker.businessName
            }</h3>
            <p style="margin: 5px 0;"><strong>Category:</strong> ${
              marker.markerType
            }</p>
            <p style="margin: 5px 0;"><strong>Rating:</strong> ⭐ ${
              marker.rating
            } (${marker.reviews} reviews)</p>
            <p style="margin: 5px 0;"><strong>Price:</strong> ${
              marker.price
            }</p>
            <p style="margin: 5px 0; font-size: 12px; color: #666;">
                <strong>Location:</strong> ${marker.position.lat.toFixed(
                  6
                )}, ${marker.position.lng.toFixed(6)}
            </p>
        </div>
    `;

  infoWindow.setContent(content);
  infoWindow.open(map, marker);

  // Update sidebar info
  document.getElementById("selectedMarkerInfo").innerHTML = `
        <div class="marker-info">
            <div class="marker-title">${marker.businessName}</div>
            <div class="marker-details">
                Type: ${marker.markerType}<br>
                Rating: ${marker.rating}/5<br>
                Reviews: ${marker.reviews}<br>
                Price: ${marker.price}
            </div>
        </div>
    `;
}

function filterMarkers() {
  const selectedType = document.getElementById("markerType").value;
  const radius = parseInt(document.getElementById("radiusFilter").value);

  let filteredMarkers = markers;

  if (selectedType !== "all") {
    filteredMarkers = markers.filter(
      (marker) => marker.markerType === selectedType
    );
  }

  // Update cluster with filtered markers
  markerCluster.clearMarkers();
  markerCluster.addMarkers(filteredMarkers);

  updateStats();
}

function regenerateMarkers() {
  generateMarkers();
}

function fitAllMarkers() {
  const bounds = new google.maps.LatLngBounds();
  markers.forEach((marker) => {
    bounds.extend(marker.position);
  });
  map.fitBounds(bounds);
}

function initHeatmap() {
  const heatmapData = markers.map((marker) => ({
    location: new google.maps.LatLng(marker.position.lat, marker.position.lng),
    weight: Math.random() * 10,
  }));

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    map: null, // Initially hidden
  });
}

function toggleHeatmap() {
  if (heatmap.getMap()) {
    heatmap.setMap(null);
  } else {
    heatmap.setMap(map);
  }
}

function updateStats() {
  document.getElementById("markerCount2").textContent =
    markers.length.toLocaleString();
  document.getElementById("zoomLevel").textContent = map.getZoom();

  // Count visible markers (approximate)
  const bounds = map.getBounds();
  if (bounds) {
    const visibleMarkers = markers.filter((marker) =>
      bounds.contains({ lat: marker.position.lat, lng: marker.position.lng })
    );
    document.getElementById("visibleCount").textContent =
      visibleMarkers.length.toLocaleString();
  }

  // Estimate cluster count
  const zoomLevel = map.getZoom();
  const estimatedClusters = Math.max(
    1,
    Math.floor(markers.length / Math.pow(2, zoomLevel - 5))
  );
  document.getElementById("clusterCount").textContent =
    estimatedClusters.toLocaleString();
}

// Menu toggle functions
function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const menuToggle = document.getElementById("menuToggle");

  sidebar.classList.toggle("open");
  overlay.classList.toggle("open");
  menuToggle.classList.toggle("open");
}

function closeMenu() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const menuToggle = document.getElementById("menuToggle");

  sidebar.classList.remove("open");
  overlay.classList.remove("open");
  menuToggle.classList.remove("open");
}

// Close menu when clicking on map
function initMapClickHandler() {
  if (map) {
    map.addListener("click", function () {
      if (window.innerWidth <= 767) {
        closeMenu();
      }
    });
  }
}

// Make functions globally available
window.initMap = initMap;
window.regenerateMarkers = regenerateMarkers;
window.fitAllMarkers = fitAllMarkers;
window.toggleHeatmap = toggleHeatmap;
window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;
