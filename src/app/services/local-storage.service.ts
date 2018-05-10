import {Injectable} from '@angular/core';
import {FavoriteMovie} from "../classes/favorite-movie";

@Injectable()
export class LocalStorageService {

  private useLocalStorage: boolean = true;                   //switch to LocalStorage instead of DB
  private favMoviesList: FavoriteMovie[] =[];

  constructor() {
  }

  usingLocalStorage(): boolean {
    return this.useLocalStorage;
  }

  readFavMoviesFromLS() {
    if (typeof(Storage) !== "undefined") {
      this.favMoviesList = JSON.parse(window.localStorage.getItem('igsFavMovies'))? JSON.parse(window.localStorage.getItem('igsFavMovies')) : [];
      //console.log("Read from LS: ", this.favMoviesList);
    } else {
      console.error("Local Storage is now supported!");
      this.favMoviesList = null;
    }
  }

  writeFavMoviesToLS(moviesArray) {
    if (typeof(Storage) !== "undefined") {
      window.localStorage.setItem('igsFavMovies', JSON.stringify(moviesArray));
    } else {
      console.error("Local Storage is now supported!");
    }
  }

  addMovieToFavsList(movie: FavoriteMovie) {
    this.favMoviesList.push(movie);
    this.writeFavMoviesToLS(this.favMoviesList);

  }

  removeMovieFromFavsList(movie) {
    this.favMoviesList = this.favMoviesList.filter(value => {
      return value.imdbID !== movie.imdbID;
    });
    this.writeFavMoviesToLS(this.favMoviesList);

  }

  getFavoriteMovies() {
    this.readFavMoviesFromLS();
    return this.favMoviesList;
  }

  movieIsInFavorites(movieId): boolean {
    let result = false;
    if (this.favMoviesList){
      this.favMoviesList.forEach(value => {
        if (value.imdbID == movieId) {
          result = true;
        }
      });
    }

    return result;
  }

  /*movieIsNotInFavorites(movieId): boolean {
    let result = false;
    if (this.favMoviesList){
      this.favMoviesList.forEach(value => {
        if (value.imdbID == movieId) {
          result = true;
        }
      });
    }

    return !result;
  }*/
}
