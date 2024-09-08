import { Component } from '@angular/core';

@Component({
    selector: 'app-favorite',
    templateUrl: './favorite.component.html',
    styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent {
    favoriteList: any;
    getFavorite() {
        var favoriteContent = localStorage.getItem('favorite');
        if (favoriteContent == null) {
            favoriteContent = '[]'
        }
        this.favoriteList = JSON.parse(favoriteContent)  // change from string to list
        if (this.favoriteList[0] == null) {
            this.favoriteList.splice(0, 1)
        }
    }
    ngOnInit() {
        this.getFavorite();
        console.log(this.favoriteList);
    }

    deleteFavorite(i: number) {
        this.favoriteList.splice(i, 1)
        localStorage.setItem('favorite', JSON.stringify(this.favoriteList));
        alert("Removed from Favorites!");
    }

}
