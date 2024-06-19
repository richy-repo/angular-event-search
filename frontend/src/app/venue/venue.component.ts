import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent {
  @Input() venueDetailContent: any;
  show = [true, true, true];
  marker = {
    position: { lat: 38.9987208, lng: -77.2538699 },
 }
  mapOptions: google.maps.MapOptions = {
    center: { lat: 38.9987208, lng: -77.2538699 },
    zoom : 14
  } 
  map = false;
  ngOnInit(){
    console.log(this.venueDetailContent)
  }
  showtoggle(index:any) {
    this.show[index] = !this.show[index]
  }

  showmap() {
    this.mapOptions.center = this.venueDetailContent.position
    this.map = true;
  }

  closemap() {
    this.map = false;
  }

}
