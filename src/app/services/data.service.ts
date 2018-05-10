import {Injectable} from '@angular/core';
import {FavoriteMovie} from "../classes/favorite-movie";
import {HttpService} from "./http.service";
import {AuthService} from "./auth.service";

@Injectable()
export class DataService {

  private cache: Map<string, { date: Date, content }> = new Map<string, { date: Date, content }>();
  private maxStoredValues: number = 1000;
  private partClear: number = Math.ceil(this.maxStoredValues * 0.4);
  private maxStoreTime: number = 3 * 60 * 1000;     //3 min - in ms

  private dataReady: boolean = false;

  constructor(private httpService: HttpService, private auth: AuthService) {
  }

  store(key: string, value: any): void {
    //this.deleteOutdated();
    if (Math.floor(this.maxStoredValues) > 0) {           //if cache is on (>0)
      if (this.cache.size >= this.maxStoredValues) {      //if cache max size is reached - delete ${partClear} first entries
        let i = 0;
        this.cache.forEach((value1, key1) => {
          if (i <= this.partClear) {
            this.cache.delete(key1);
            i++;
          }
        });
        //console.log("Current cache size(AFTER CUT): ", this.cache.size);
      }
      this.cache.set(key, {date: new Date(), content: value});
      //console.log("Current cache size: ", this.cache.size);
    }
  }

  getValue(key: string): any {
    //this.deleteOutdated();
    return this.cache.get(key).content;
  }

  hasValue(key: string): boolean {
    //this.deleteOutdated();
    return this.cache.has(key);
  }

  deleteOutdated() {
    let now = new Date();
    this.cache.forEach((value, key) => {
      if ((now.getTime() - value.date.getTime()) > this.maxStoreTime) {     //delete outdated entries
        this.cache.delete(key);
      }
    });
  }

  seeCache() {
    console.error("-----Cache:-------", this.cache.size);
    this.cache.forEach((value, key) => {
      console.log(`${key} - `, value);
    });
    console.error("-----Cache Over-------");
  }

  addMovie(movie, username) {
    this.getValue(username).push(movie);
    //console.log('Pushed movie: ', movie, this.getValue(username));
  }

  deleteMovie(movie, username) {
    let newArray = this.getValue(username).filter(value => {
      return value.imdbID !== movie.imdbID;
    });
    //console.log('Deleted movie: ', movie, this.getValue(username));
    this.store(username, newArray);
  }

  setDataReady(bool: boolean) {
    this.dataReady = bool;
  }

  static paramsReducer9000(params): string {
    let startingString = "";
    let str = Object.keys(params).reduce((previousValue, currentItem, index, arr) => {
      let and = "";
      if (index > 0) {
        and = "&";
      }

      if (params[currentItem]) {
        if ((currentItem === "t") || (currentItem === "s")) {
          return previousValue + and + currentItem + "=" + params[currentItem].trim().replace(/ +/g, "+");

        }
        return previousValue + and + currentItem + "=" + params[currentItem];
      }
      return previousValue;
    }, startingString);
    return str;
  }

  addToFavorites(movie) {
    let favMovie: FavoriteMovie = {
      imdbID: movie.imdbID,
      Poster: movie.Poster,
      Title: movie.Title,
      Year: movie.Year,
      user_name: this.auth.isLoggedAs()
    };
    this.httpService.addMovieToFavorites(favMovie).subscribe(value => {
      //console.log("Movie added: ", value);
    });
  }

  removeFromFavorites(movie) {
    this.httpService.removeFromFavorites(this.auth.isLoggedAs(), movie.imdbID).subscribe(value => {
      //console.log("Movie removed: ", value);
    });
  }


  movieIsInFavorites(movieId): boolean {
    let result = false;
    if (this.dataReady) {
      this.getValue(this.auth.isLoggedAs()).forEach(value => {
        if (value.imdbID == movieId) {

          result = true;
        }
      });
    }
    return !this.auth.isLogged() || (this.auth.isLogged() && result);
  }

  movieIsNotInFavorites(movieId): boolean {
    let result = false;
    if (this.dataReady) {
      this.getValue(this.auth.isLoggedAs()).forEach(value => {
        if (value.imdbID == movieId) {

          result = true;
        }
      });
    }
    return !this.auth.isLogged() || (this.auth.isLogged() && !result);
  }

  convertToFavoriteMoviesType(value): FavoriteMovie[] {
    return value.map((value1, index) => {
      value1['imdbID'] = value1['imdbid'];
      value1['Title'] = value1['title'];
      value1['Poster'] = value1['poster'];
      value1['Year'] = value1['year'];
      delete value1['imdbid'];
      delete value1['title'];
      delete value1['poster'];
      delete value1['year'];
      return value1;
    });
  }

}
