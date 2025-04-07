import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapLoaderService {
  private isLoaded = false;

  load(): Promise<void> {
    if (this.isLoaded) return Promise.resolve();

    return new Promise((resolve, reject) => {
      if ((window as any).google && (window as any).google.maps) {
        this.isLoaded = true;
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  calculateRoute(
    origin: google.maps.LatLng | google.maps.LatLngLiteral,
    destination: google.maps.LatLng | google.maps.LatLngLiteral
  ): Promise<google.maps.DirectionsResult> {
    return new Promise((resolve, reject) => {
      if (!(window as any).google || !(window as any).google.maps) {
        reject('Google Maps API is not loaded');
        return;
      }
      const directionsService = new google.maps.DirectionsService();
      const directionsRequest: google.maps.DirectionsRequest = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(directionsRequest, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          if (response) {
            resolve(response);
          } else {
            reject('No route found');
          }
        } else {
          reject(`Error fetching directions: ${status}`);
        }
      });
    });
  }
}
