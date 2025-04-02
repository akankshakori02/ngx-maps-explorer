import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMapLoaderService } from '../../services/mapLoaderService/google-map-loader.service';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, AfterViewInit {  
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  center = { lat: 53.3498, lng: -6.2603 };
  zoom = 12;
  isMapLoaded = false;

  constructor(private googleMapsLoader: GoogleMapLoaderService) {}
  ngOnInit(): void {
    this.googleMapsLoader.load().then(() => {
      console.log('Google Maps API Loaded');
      this.isMapLoaded = true;
      this.initMap();
    }).catch(err => console.error('Error loading Google Maps', err));
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    if (!(window as any).google || !(window as any).google.maps) {
      console.log('Google Maps API is not loaded yet!');
      return;
    }
    if (!this.mapContainer) {
      console.log('Map container is not available!');
      return;
    }

    const map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: this.center,
      zoom: this.zoom
    });
  }

}
