import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoursquareService } from '../../services/foursquare/foursquare.service';

@Component({
  selector: 'app-details',
  standalone: false,
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  placeId: string | null = null;
  placeDetails: any;

  constructor(
    private route: ActivatedRoute,
    private foursquareService: FoursquareService
  ) {}

  ngOnInit(): void {
    this.placeId = this.route.snapshot.paramMap.get('id');
    if (this.placeId) {
      this.foursquareService.getPlaceById(this.placeId).subscribe(
        (data) => {
          this.placeDetails = data;
        },
        (error) => {
          console.error('Error fetching place details:', error);
        }
      );
    }
  }
}
