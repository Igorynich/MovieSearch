import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataService} from "../services/data.service";
import {AuthService} from "../services/auth.service";
import {LocalStorageService} from "../services/local-storage.service";
import {FavoriteMovie} from "../classes/favorite-movie";

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {

  @Input() moviesArray:FavoriteMovie[];
  noPosterSubLink = 'http://www.eurodiesel.com/images/img-not-found.gif';
  @Output() movieRemoved = new EventEmitter<object>();        //prob no needed
  @Output() movieAddedToFavs = new EventEmitter<object>();    //prob no needed


  constructor(private dataService: DataService, private auth:AuthService, private local: LocalStorageService) { }

  ngOnInit() {

  }

  addToFavorites(movie) {
    if (!this.local.usingLocalStorage()){
      this.dataService.addToFavorites(movie);                        //1
      this.movieAddedToFavs.emit(movie);        //prob no needed
      this.dataService.addMovie(movie, this.auth.isLoggedAs());     //check these 2 on optimization
    } else{
      this.local.addMovieToFavsList(movie);
    }
  }

  removeFromFavorites(movie) {
    if (!this.local.usingLocalStorage()){
      this.dataService.removeFromFavorites(movie);
      this.movieRemoved.emit(movie);          //NEEDED
      this.dataService.deleteMovie(movie, this.auth.isLoggedAs());
    } else {
      this.local.removeMovieFromFavsList(movie);
      this.movieRemoved.emit(movie);          //NEEDED for updating favlist on delete
    }

  }

  movieIsInFavorites(movieId):boolean{
    if (!this.local.usingLocalStorage()) {
      return this.dataService.movieIsInFavorites(movieId);
    } else {
      return this.local.movieIsInFavorites(movieId);
    }

  }
  movieIsNotInFavorites(movieId):boolean{
    if (!this.local.usingLocalStorage()) {
      return this.dataService.movieIsNotInFavorites(movieId);
    } else {
      return this.local.movieIsNotInFavorites(movieId);
    }

  }

}
