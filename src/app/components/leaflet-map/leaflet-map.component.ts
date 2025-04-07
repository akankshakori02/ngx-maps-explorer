import { Component, OnDestroy, OnInit } from '@angular/core';
import * as leaf from 'leaflet';
import { FoursquareService } from '../../services/foursquare/foursquare.service';
import { Subject, Subscription, debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-leaflet-map',
  standalone: false,
  templateUrl: './leaflet-map.component.html',
  styleUrl: './leaflet-map.component.css',
})
export class LeafletMapComponent implements OnInit, OnDestroy {
  map!: L.Map;
  allPlaces: any[] = [];
  filteredPlaces: any[] = [];
  markers: L.Marker[] = [];
  categories: { id: number; name: string }[] = [];
  searchQuery: string = '';
  radius: number = 1000;
  selectedCategoryId: number | null = null;
  private mapMoveSubject = new Subject<{ lat: number; lng: number }>();
  private moveSubscription!: Subscription;

  constructor(private foursquareService: FoursquareService) {}

  ngOnInit(): void {
    this.initMap();
    this.moveSubscription = this.mapMoveSubject
      .pipe(
        debounceTime(500),
        switchMap(({ lat, lng }) =>
          this.foursquareService.getPlaces(lat, lng, this.radius)
        )
      )
      .subscribe((places) => {
        this.allPlaces = places.results || places;
        this.filteredPlaces = [...this.allPlaces];
        this.displayMarkers();
        this.extractCategories(this.allPlaces);
      });
  }

  ngOnDestroy(): void {
    this.moveSubscription.unsubscribe();
  }

  onRadiusChange(): void {
    const center = this.map.getCenter();
    this.mapMoveSubject.next({ lat: center.lat, lng: center.lng });
  }

  initMap(): void {
    this.map = leaf.map('map', {
      center: [53.3498, -6.2603], // Dublin
      zoom: 14,
    });

    leaf
      .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
      .addTo(this.map);
    delete (leaf.Icon.Default.prototype as any)._getIconUrl;
    leaf.Icon.Default.mergeOptions({
      iconRetinaUrl: '/assets/leaflet/marker-icon-2x.png',
      iconUrl: '/assets/leaflet/marker-icon.png',
      shadowUrl: '/assets/leaflet/marker-shadow.png',
    });

    // Listen to map move or zoom end
    this.map.on('moveend', () => {
      const center = this.map.getCenter();
      this.mapMoveSubject.next({ lat: center.lat, lng: center.lng });
    });

    // Initial load
    const center = this.map.getCenter();
    this.mapMoveSubject.next({ lat: center.lat, lng: center.lng });
  }

  extractCategories(places: any[]): void {
    const categoryMap = new Map<number, string>();
    places.forEach((place) => {
      place.categories?.forEach((category: any) => {
        if (!categoryMap.has(category.id)) {
          categoryMap.set(category.id, category.name);
        }
      });
    });

    this.categories = Array.from(categoryMap, ([id, name]) => ({ id, name }));
  }

  displayMarkers(): void {
    this.clearMarkers();
    this.filteredPlaces.forEach((place) => {
      const coords = place.geocodes?.main;
      const name = place.name;
      const address =
        place.location?.formatted_address || place.location?.address || 'N/A';
      const description = place.categories
        ? place.categories.map((cat: any) => cat.name).join(', ')
        : 'No description';
      const image = place.photos
        ? `<img src="${place.photos[0]?.prefix}300x300${place.photos[0]?.suffix}" alt="${name}" />`
        : '';

      if (coords) {
        const marker = leaf
          .marker([coords.latitude, coords.longitude])
          .addTo(this.map).bindPopup(`
          <div class="popup-content">
            <h4>${name}</h4>
            <h6>${description}</h6>
            <p>${address}</p>
            ${image}
            <a href="/details/${place.fsq_id}" >
        <button class="btn btn-primary btn-sm mt-2">More Info</button>
      </a>
          </div>
        `);
        this.markers.push(marker);
      }
    });
  }

  clearMarkers(): void {
    this.markers.forEach((marker) => this.map.removeLayer(marker));
    this.markers = [];
  }

  filterMarkers(): void {
    this.filteredPlaces = this.allPlaces.filter((place) => {
      const matchesName = place.name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategoryId
        ? place.categories.some(
            (cat: any) => cat.id === this.selectedCategoryId
          )
        : true;

      return matchesName && matchesCategory;
    });
    this.displayMarkers();
  }
}
