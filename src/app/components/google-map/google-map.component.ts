import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { GoogleMapLoaderService } from '../../services/mapLoaderService/google-map-loader.service';
import { FoursquareService } from '../../services/foursquare/foursquare.service';
import { Subject, Subscription, debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  standalone: false,
  styleUrls: ['./google-map.component.css'],
})
export class GoogleMapComponent implements OnInit, OnDestroy {
  map!: google.maps.Map;
  allPlaces: any[] = [];
  filteredPlaces: any[] = [];
  markers: google.maps.Marker[] = [];
  startMarker: google.maps.Marker | null = null;
  destinationMarker: google.maps.Marker | null = null;
  categories: { id: number; name: string }[] = [];
  searchQuery: string = '';
  radius: number = 1000;
  selectedCategoryId: number | null = null;
  center = { lat: 53.3498, lng: -6.2603 }; // Dublin
  zoom = 14;
  private mapMoveSubject = new Subject<{ lat: number; lng: number }>();
  private moveSubscription!: Subscription;

  constructor(
    private googleMapsLoader: GoogleMapLoaderService,
    private foursquareService: FoursquareService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.googleMapsLoader
      .load()
      .then(() => {
        console.log('Google Maps API Loaded');
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
            this.cdr.markForCheck();
          });
      })
      .catch((err) => console.error('Error loading Google Maps', err));
    this.setupMarkers();
  }

  ngOnDestroy(): void {
    if (this.moveSubscription) {
      this.moveSubscription.unsubscribe();
    }
  }

  initMap(): void {
    const mapOptions: google.maps.MapOptions = {
      center: this.center,
      zoom: this.zoom,
    };
    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      mapOptions
    );
    google.maps.event.addListener(this.map, 'center_changed', () => {
      const center = this.map.getCenter();
      if (center) {
        this.mapMoveSubject.next({ lat: center.lat(), lng: center.lng() });
      } else {
        console.error('Map center is undefined');
      }
    });
  }

  onRadiusChange(): void {
    const center = this.map.getCenter();
    if (center) {
      this.mapMoveSubject.next({ lat: center.lat(), lng: center.lng() });
    } else {
      console.error('Map center is undefined');
    }
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
        const marker = new google.maps.Marker({
          position: { lat: coords.latitude, lng: coords.longitude },
          map: this.map,
          title: name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="popup-content">
              <h4>${name}</h4>
              <h6>${description}</h6>
              <p>${address}</p>
              ${image}
              <a href="/details/${place.fsq_id}">
                <button class="btn btn-primary btn-sm mt-2">More Info</button>
              </a>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(this.map, marker);
        });

        this.markers.push(marker);
      }
    });
  }

  clearMarkers(): void {
    this.markers.forEach((marker) => marker.setMap(null));
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

  setupMarkers(): void {
    const markerData = [
      { title: 'Trinity College', lat: 53.3438, lng: -6.2546 },
      { title: "St. Stephen's Green", lat: 53.3382, lng: -6.2591 },
    ];

    markerData.forEach((data) => {
      const marker = new google.maps.Marker({
        position: { lat: data.lat, lng: data.lng },
        map: this.map,
        title: data.title,
      });

      this.markers.push(marker);
    });
  }
  // start location change
  onStartChange(event: Event): void {
    const selectedStart = (event.target as HTMLSelectElement).value;
    this.startMarker =
      this.markers.find((marker) => marker.getTitle() === selectedStart) ||
      null;
  }

  // destination location change
  onDestinationChange(event: Event): void {
    const selectedDestination = (event.target as HTMLSelectElement).value;
    this.destinationMarker =
      this.markers.find(
        (marker) => marker.getTitle() === selectedDestination
      ) || null;
  }

  // Trigger route calculation
  onCalculateRoute(): void {
    const origin = { lat: 53.3498, lng: -6.2603 }; 
    const destination = { lat: 53.3382, lng: -6.2591 }; 

    this.googleMapsLoader
      .load()
      .then(() => {
        this.googleMapsLoader
          .calculateRoute(origin, destination)
          .then((response) => {
            console.log('Route found:', response);
          })
          .catch((error) => {
            console.error('Error calculating route:', error);
          });
      })
      .catch((error) => {
        console.error('Google Maps API failed to load:', error);
      });
  }
}
