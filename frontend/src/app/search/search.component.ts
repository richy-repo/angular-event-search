import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  formInfo: any = {
    keyword: '',
    category: '',
    distance: '',
    from: false,
    fromLocation: '',
    latitude: '',
    longitude: '',
  }

  keywordControl = new FormControl();
  options: string[] = [];
  eventsContent:any = [];
  norecord:boolean = false;
  selectedEvent: any;
  showDetail:boolean=false

  artists:any=[];

 detailContent = {
    ArtistTeam: '',
    ArtistTeamList: [''],
    Venue: '',
    VenueId: '',
    Time: '',
    date: '', // for favorite
    genres: '',
    PriceRange: '',
    TicketStatus: '',
    BuyTicketAt: '',
    SeatMap: '',
    Name: '',
    statusColor:{},
    id:''
  }

venueDetailContent = {
  name: '',
  Address: '',
  City: '',
  PhoneNumber: '',
  OpenHours: '',
  GeneralRule: '',
  ChildRule: '',
  position:{lat:0, lng:0}
}

favoriteList:any;
isFavorite?:boolean;



// decide to use current location or not
search(){
  if (this.formInfo.keyword =="") {
    console.log("does not run")
    return 0;
  }
  if(!this.formInfo.from){
      var googleGeoApi_base_url = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBDUst685JCxVXkMy_kDYnslTN3yscwF1c&address="
      var location = this.formInfo.fromLocation;
      if (location == "") {
        console.log("no location")
        return 0;
      }
      googleGeoApi_base_url += location
      var response = fetch(googleGeoApi_base_url)
      response.then(res => res.json())
              .then((geo_data)=>{
                  if (geo_data.results.length == 0) {
                    this.norecord = true;
                  } else {
                    this.formInfo.latitude = geo_data["results"][0]["geometry"]["location"]["lat"]
                    this.formInfo.longitude = geo_data["results"][0]["geometry"]["location"]["lng"]
                    this.requestBackend();
                  }
              })
  }
  else{
      var geo_url = "https://ipinfo.io/?token=56092a13281c15";
      var responsePromise = fetch(geo_url);
      responsePromise
          .then(function(response) {
                  return response.json();
              })
          .then((geoData)=>{
              var location = geoData["loc"]
              var location_lat = location.substring(0, location.indexOf(','))
              var location_log = location.substring(location.indexOf(',') + 1, location.length)
              this.formInfo.latitude = location_lat
              this.formInfo.longitude = location_log
              this.requestBackend();
          })
  }
  return 0;
}

requestBackend(){
  this.norecord = false;
  this.eventsContent = [];
  // var backend_url = "http://127.0.0.1:3000/search?"
  var backend_url = "/search?"
  var keyword = this.formInfo.keyword;
  var category = this.formInfo.category;
  var distance = this.formInfo.distance;
  if(distance == ''){
      distance = 10
  }
  backend_url += "keyword=" + keyword
  backend_url += "&category=" + category
  backend_url += "&distance=" + distance
  backend_url += "&latitude=" + this.formInfo.latitude
  backend_url += "&longitude=" + this.formInfo.longitude
  var response = fetch(backend_url)
  response.then(res => res.json())
          .then((events_data)=>{
              if(events_data.page.totalElements == 0){  
                  this.norecord = true;
              }
              else{
                this.eventsContent = events_data["_embedded"]["events"];

}})
}

displayDetail(j: any) {
  this.showDetail = true;
  this.selectedEvent = this.eventsContent[j];
  // console.log(this.selectedEvent);
  this.detailContent.Time = this.selectedEvent.dates.start.localDate;
  this.detailContent.date = this.selectedEvent.dates.start.localDate;
  if (this.selectedEvent.dates.start.hasOwnProperty("localTime")) {
    this.detailContent.Time = this.detailContent.Time + " " + this.selectedEvent.dates.start.localTime;
  } 

  this.detailContent.Name = this.selectedEvent.name;
  var ArtistTeamList = ''
  this.artists = [];
  if(this.selectedEvent.hasOwnProperty("_embedded") && this.selectedEvent._embedded.hasOwnProperty("attractions")){
      for(var i = 0; i < this.selectedEvent._embedded.attractions.length; ++i){
        ArtistTeamList += this.selectedEvent._embedded.attractions[i].name

        this.artists.push(this.selectedEvent._embedded.attractions[i].name);

        if(i != this.selectedEvent._embedded.attractions.length-1){
            ArtistTeamList += " | "
        }
      }
  }
  this.detailContent.ArtistTeam = ArtistTeamList;

  this.detailContent.Venue =  this.selectedEvent._embedded.venues[0].name

  var GenresList = ''
  if(this.selectedEvent.hasOwnProperty("classifications")){
      if(this.selectedEvent.classifications[0].hasOwnProperty("subGenre") && this.selectedEvent.classifications[0].subGenre.name != 'Undefined'){
          GenresList += this.selectedEvent.classifications[0].subGenre.name 
      }
      if(this.selectedEvent.classifications[0].hasOwnProperty("genre") && this.selectedEvent.classifications[0].genre.name != 'Undefined'){
          GenresList += ' | ' + this.selectedEvent.classifications[0].genre.name
      }
      if(this.selectedEvent.classifications[0].hasOwnProperty("segment") && this.selectedEvent.classifications[0].segment.name != 'Undefined'){
          GenresList += ' | ' + this.selectedEvent.classifications[0].segment.name
      }
      if(this.selectedEvent.classifications[0].hasOwnProperty("subType") && this.selectedEvent.classifications[0].subType.name != 'Undefined'){
          GenresList += ' | ' + this.selectedEvent.classifications[0].subType.name
      }
      if(this.selectedEvent.classifications[0].hasOwnProperty("type") && this.selectedEvent.classifications[0].type.name != 'Undefined'){
          GenresList += ' | ' + this.selectedEvent.classifications[0].type.name
      }
  }
  this.detailContent.genres = GenresList;
  if(this.selectedEvent.hasOwnProperty("priceRanges")){
    this.detailContent.PriceRange = this.selectedEvent.priceRanges[0].min + '-' + this.selectedEvent.priceRanges[0].max + " " + this.selectedEvent.priceRanges[0].currency;
  }
  this.detailContent.TicketStatus = this.selectedEvent.dates.status.code
  this.detailContent.BuyTicketAt = this.selectedEvent.url
  if(this.selectedEvent.hasOwnProperty("seatmap")){
    this.detailContent.SeatMap = this.selectedEvent.seatmap.staticUrl
  }
  this.detailContent.statusColor = {'btn-success':this.detailContent.TicketStatus==='onsale',
  'btn-danger':this.detailContent.TicketStatus==='offsale',
  'btn-dark':this.detailContent.TicketStatus==='cancelled',
  'btn-warning':this.detailContent.TicketStatus==='rescheduled'||this.detailContent.TicketStatus==='postponed',}

  this.detailContent.id = this.selectedEvent.id
  this.isFavorite = this.searchFavorite();

  this.requestVenue(this.detailContent.Venue)

}

requestVenue(keyword:any) {
  var backend_url = "/venue?"
  // var backend_url = "http://127.0.0.1:3000/venue?"
  backend_url += "keyword=" + keyword;
  backend_url = backend_url.replace(' ', '%20');
  var response = fetch(backend_url)
  response.then(res => res.json())
          .then((response)=>{
            if (response.hasOwnProperty('_embedded')){
              response = response._embedded;
            }
            this.venueDetailContent = {
              name: '',
              Address: '',
              City: '',
              PhoneNumber: '',
              OpenHours: '',
              GeneralRule: '',
              ChildRule: '',
              position:{lat:0, lng:0}
            }
            this.venueDetailContent.name = this.detailContent.Venue;
            if(response.hasOwnProperty('venues') && response.venues.length > 0){
                for(var k = 0; k < response.venues.length; ++k){
                  if(response.venues[k].name != this.detailContent.Venue){
                    continue
                  }
                  console.log("venue,", response.venues[k])
                  this.venueDetailContent.position.lat = parseFloat(response.venues[k].location.latitude)
                  this.venueDetailContent.position.lng = parseFloat(response.venues[k].location.longitude)
                  // Address
                  if(response.venues[k].hasOwnProperty('address')){
                    if(response.venues[k].address.hasOwnProperty('line1')){
                      this.venueDetailContent.Address = response.venues[k].address.line1
                    }
                  }
    
                  // City
                  if(response.venues[k].hasOwnProperty('city')){
                    if(response.venues[k].city.hasOwnProperty('name')){
                      this.venueDetailContent.City = response.venues[k].city.name
                    }
                  }
    
                  if(response.venues[k].hasOwnProperty('state')){
                    if(response.venues[k].city.hasOwnProperty('name')){
                      this.venueDetailContent.City += ', ' + response.venues[k].state.name
                    }
                  }
    
                  if(response.venues[k].hasOwnProperty('boxOfficeInfo')){
                    // Phone Number
                    if(response.venues[k].boxOfficeInfo.hasOwnProperty('phoneNumberDetail')){
                      this.venueDetailContent.PhoneNumber = response.venues[k].boxOfficeInfo.phoneNumberDetail
                    }
    
                    // Open hours
                    if(response.venues[k].boxOfficeInfo.hasOwnProperty('openHoursDetail')){
                      this.venueDetailContent.OpenHours = response.venues[k].boxOfficeInfo.openHoursDetail
                    }
                  }
    
                  if(response.venues[k].hasOwnProperty('generalInfo')){
                    // General Rule
                    if(response.venues[k].generalInfo.hasOwnProperty('generalRule')){
                      this.venueDetailContent.GeneralRule = response.venues[k].generalInfo.generalRule
                    }
    
                    // Child Rule
                    if(response.venues[k].generalInfo.hasOwnProperty('childRule')){
                      this.venueDetailContent.ChildRule = response.venues[k].generalInfo.childRule
                    }
                  }
                  // console.log("this.venueDetailContent", this.venueDetailContent)
                }
            }
          })

}

clearAll(){
    this.formInfo= {
      keyword: '',
      category: '',
      distance: '',
      from: false,
      fromLocation: '',
      latitude: '',
      longitude: '',
    }
    this.eventsContent = [];
    this.selectedEvent = null;
    this.showDetail = false;
    this.norecord = false;
}

ngOnInit() {
  this.keywordControl.valueChanges.subscribe((realTimeKeyword: any) => {
    this.requestBackendToAutoComplete(realTimeKeyword)
  })
  this.getFavorite()
}

requestBackendToAutoComplete(keyword:String){
  // var backendUrl = "http://127.0.0.1:3000/autocomplete?"
  var backendUrl = "/autocomplete?"
  backendUrl += "keyword=" + keyword
  fetch(backendUrl)
    .then(resAutoCompleteData => resAutoCompleteData.json())
    .then(resAutoCompleteData => {
      var autoCompleteContent = []
      for(var i = 0; i < resAutoCompleteData.attractions.length; ++i){
        autoCompleteContent.push(resAutoCompleteData.attractions[i].name)
      }
      this.options = autoCompleteContent
    })
}

back() {
  this.showDetail = false;
}

// determines whether add favorite or delete favorite
alertme() {
  if (this.searchFavorite()) {
    this.deleteFavorite()
    alert("Removed from Favorites!");
  } else {
    this.addFavorite();
    alert('events added to favorites');
    // console.log("favorite list:",this.favoriteList);
  }
  this.isFavorite = this.searchFavorite();
}

    
getFavorite() {
  var favoriteContent = localStorage.getItem('favorite');
  if(favoriteContent == null){ 
    favoriteContent = '[]'
  }
  this.favoriteList = JSON.parse(favoriteContent)  // change from string to list
  if(this.favoriteList[0] == null){
    this.favoriteList.splice(0,1)
  }
  // console.log("get favorite list", this.favoriteList);
}

addFavorite() {
  console.log("I am called")
  this.favoriteList.push(this.detailContent);
  // set local storage
  localStorage.setItem('favorite', JSON.stringify(this.favoriteList))  
  this.getFavorite();
}

// deleteFavorite if current event is in favorite
deleteFavorite() {
  for(var i = 0; i < this.favoriteList.length; ++i){
    if(this.favoriteList[i] != null && 
      this.favoriteList[i].hasOwnProperty('id') && 
      this.favoriteList[i].id == this.detailContent.id){
      // delete from favorite list
      this.favoriteList.splice(i,1)
      localStorage.setItem('favorite', JSON.stringify(this.favoriteList));
      console.log("delete favorite")
      break
    }
  }

}

// return if the current event is in favorite
searchFavorite():boolean {
  // console.log("curent event:", this.detailContent);
  // console.log("favorite list:",this.favoriteList);
  for(var i = 0; i < this.favoriteList.length; ++i){
    if(this.favoriteList[i] != null && 
      this.favoriteList[i].hasOwnProperty('id') && 
      this.favoriteList[i].id === this.detailContent.id){
      // console.log("current event is in favorite")
      // console.log(this.favoriteList[i].id, this.detailContent.id)
      return true;  
    }
  }
  // console.log("current event is not in favorite")
  return false;
}

}
