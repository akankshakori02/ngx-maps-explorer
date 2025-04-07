import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapLoaderService } from './services/mapLoaderService/google-map-loader.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LeafletMapComponent } from './components/leaflet-map/leaflet-map.component';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { HomeComponent } from './components/home/home.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DetailsComponent } from './components/details/details.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    LeafletMapComponent,
    GoogleMapComponent,
    HomeComponent,
    BackButtonComponent,
    DetailsComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    DragDropModule,
    FormsModule,
    HttpClientModule,
  ],
  exports: [BackButtonComponent],
  providers: [GoogleMapLoaderService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
