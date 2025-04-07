import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FoursquareService {
  private apiKey = environment.foursquareApiKey;

  constructor(private http: HttpClient) {}

  getPlaces(lat: number, lng: number, radius: number = 1000): Observable<any> {
    const url = 'https://api.foursquare.com/v3/places/search';
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: this.apiKey,
    });
    const params = new HttpParams()
      .set('ll', `${lat},${lng}`)
      .set('radius', `${radius}`)
      .set('limit', '50');
    return this.http
      .get<any>(url, { headers, params })
      .pipe(map((response) => response.results));
  }

  getPlaceById(id: string): Observable<any> {
    const url = `https://api.foursquare.com/v3/places/${id}`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: this.apiKey,
    });
    return this.http.get<any>(url, { headers });
  }
}
