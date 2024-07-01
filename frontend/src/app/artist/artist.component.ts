import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-artist',
    templateUrl: './artist.component.html',
    styleUrls: ['./artist.component.css']
})
export class ArtistComponent {
    artistContentList?: any = [];
    @Input() artists: any = [];
    contentList: any = [];

    // develop
    // artists = ['Soulfly', 'Bodybox', 'Drift']

    pp() {
        console.log(this.artists);
    }

    ngOnInit() {
        this.pp();
        if (this.artists.length != 0) {
            this.searchArtist();
        } else {
            console.log("no artists to search");
        }
    }

    async searchArtist() {
        // Request backend to call Spotify api
        // var searchUrl = "http://127.0.0.1:3000/spotify?"
        let backend_url: string = environment.backendUrl

        let searchUrl = backend_url + "/spotify?"
        this.artistContentList = [];
        this.contentList = [];
        for (var i = 0; i < this.artists.length; ++i) {
            var searchArtistUrl = searchUrl + "artist=" + this.artists[i]
            var re = await fetch(searchArtistUrl);
            var response = await re.json();
            // console.log("spotify: ", response.artists.items);
            for (var j = 0; j < response.artists.items.length; ++j) {
                if (this.artists[i].toUpperCase() == response.artists.items[j].name.toUpperCase()) {
                    this.contentList.push(response.artists.items[j]);
                    break;
                }
            }
        }
        // console.log("content" , this.contentList);
        this.searchAlbum();
    }

    async searchAlbum() {
        // Request backend to call Spotify api
        // var searchUrl = "http://127.0.0.1:3000/spotifyAlbum?"
        let backend_url: string = environment.backendUrl

        let searchUrl = backend_url + "/spotifyAlbum?"
        for (var i = 0; i < this.contentList.length; i++) {
            var id = this.contentList[i].id;
            var searchArtistUrl = searchUrl + "id=" + id;
            var response = await fetch(searchArtistUrl);
            var re = await response.json();
            this.contentList[i].album = re.items;
        }
        // console.log("album: ", this.contentList);
    }


}
