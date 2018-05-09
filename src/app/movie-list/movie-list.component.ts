import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataService} from "../services/data.service";
import {AuthService} from "../services/auth.service";
import {HttpService} from "../services/http.service";

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {

  @Input() moviesArray:{Poster:string, Title:string, Year:string, imdbID:string}[];
  noPosterSubLink = 'http://www.eurodiesel.com/images/img-not-found.gif';
  @Output() movieRemoved = new EventEmitter<object>();
  @Output() movieAddedToFavs = new EventEmitter<object>();
  a;
  b;
  //popup: string = 'Lalalala';
  //logged: boolean;

  constructor(private dataService: DataService, private auth:AuthService, private httpService: HttpService) { }

  ngOnInit() {
    //this.logged = this.auth.isLogged();
  }

  addToFavorites(movie) {
    this.dataService.addToFavorites(movie);
    this.movieAddedToFavs.emit(movie);
    this.dataService.addMovie(movie, this.auth.isLoggedAs());
    /*this.dataService.setDataReady(false);
    this.httpService.getFavoriteMovies(this.auth.isLoggedAs()).subscribe((value:object[]) => {
      console.log("MovieList in cards: ", value);
      let movieList = this.dataService.convertToFavoriteMoviesType(value);
      this.dataService.store(this.auth.isLoggedAs(), movieList);
      this.dataService.setDataReady(true);
    });*/
  }

  removeFromFavorites(movie) {
    this.dataService.removeFromFavorites(movie);
    this.movieRemoved.emit(movie);
    this.dataService.deleteMovie(movie, this.auth.isLoggedAs());
    /*this.dataService.setDataReady(false);
    this.httpService.getFavoriteMovies(this.auth.isLoggedAs()).subscribe((value:object[]) => {
      console.log("MovieList in cards: ", value);
      let movieList = this.dataService.convertToFavoriteMoviesType(value);
      this.dataService.store(this.auth.isLoggedAs(), movieList);
      this.dataService.setDataReady(true);
    });*/
  }

  movieIsInFavorites(movieId):boolean{
    //this.logged = this.auth.isLogged();
    return this.dataService.movieIsInFavorites(movieId);
    /*if (!this.auth.isLogged()){
      return false;
    }
    if (this.dataService.getValue(this.auth.isLoggedAs()).imdbID == movieId){
      return true;
    }
    return false;*/
  }
  movieIsNotInFavorites(movieId):boolean{
    //this.logged = this.auth.isLogged();
    return this.dataService.movieIsNotInFavorites(movieId);
    /*if (!this.auth.isLogged()){
      return false;
    }
    if (this.dataService.getValue(this.auth.isLoggedAs()).imdbID == movieId){
      return true;
    }
    return false;*/
  }

}
