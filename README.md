# 🌍 Map Explorer – Angular Map Application

**Map Explorer** is a modern, responsive web application built using Angular that allows users to explore places of interest using **Google Maps API** and **Leaflet.js**. It integrates with external APIs like **Foursquare** for place data and **Google Directions API** for route visualization.

---

## 🚀 Features

- 🗺️ Switch between Google Maps and Leaflet.js
- 📍 Fetch nearby places dynamically using the **Foursquare Places API**
- 🔎 Filter places by different categories:
  - Category (e.g., Hotels, Restaurants, Attractions)
  - Name (search)
  - Radius distance (area covered)
- 📌 Interactive Markers with InfoWindows (name, category, photo(where available), and link)
- 🛣️ Route Calculation using Google Directions API (Start → Destination)
- 📷 Place details with photo preview and extra info
- ⚙️ Debounced API calls on map drag/zoom
- 🎨 Beautiful UI with Bootstrap and animated background
- 📱 Fully responsive layout
- 🔻 Floating category & filter panel
- 🔁 Custom back button for navigation
- 🔚 Footer with external resource links (LinkedIn, GitHub, NASA API)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- Angular CLI (`npm install -g @angular/cli`)
- Google Maps API key with **Maps JavaScript**, **Places**, and **Directions** APIs enabled
- Foursquare Developer Account (for Places API key)

---

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/akankshakori02/ngx-maps-explorer.git
   cd ngx-maps-explorer```

2. **Install Dependencies**
   ```npm install```

3. **Set up Environment- src/environments/environment.ts**
    ```export const environment = {
    production: false,
    apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
    foursquareApiKey: 'YOUR_FOURSQUARE_API_KEY'
    };```

4. **Run Application**
    ```ng serve```
    ## Building
    To build the project run:
    ```ng build```

5. **Open your browser and visit:**
    http://localhost:4200


### Project Structure
src/
│
├── app/
│   ├── components/
│   │   ├── back-button/
│   │   ├── details/
│   │   ├── footer/
│   │   ├── google-map/
│   │   ├── home/
│   │   └── leaflet-map/
│   ├── services/
│   │   ├── google-map-loader.service.ts
│   │   └── foursquare.service.ts
│   ├── app-routing.module.ts
│   └── app.component.ts
│
├── environments/
│   └── environment.ts
|── index.html

### Future Enhancements
Store favorite places in local storage
Dark/light theme toggle
Cluster markers for performance
Implement NgRx State Management
Integrate other Google API or open API features
Write Unit test
Optimise Application using CanLoad, LazyLoad etc

