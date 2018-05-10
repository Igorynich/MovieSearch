import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from "@angular/router";
import {HttpService} from "../services/http.service";
import {FavoriteMovie} from "../classes/favorite-movie";
import {AuthService} from "../services/auth.service";
import {DataService} from "../services/data.service";
import {LocalStorageService} from "../services/local-storage.service";

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.scss']
})
export class MovieInfoComponent implements OnInit {

  id:string;
  movie;
  noPosterSubLink = 'http://www.eurodiesel.com/images/img-not-found.gif';

  constructor(private route: ActivatedRoute, private httpService: HttpService, private auth: AuthService, private dataService: DataService, private local: LocalStorageService) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    let reqParams = {i: this.id, plot: 'full'};
    this.httpService.searchForMovies(DataService.paramsReducer9000(reqParams)).subscribe(value => {
      //console.log("Movie: ", value);
      this.movie = value;
    });
  }


  addToFavorites(movie) {
    if (!this.local.usingLocalStorage()){
      this.dataService.addToFavorites(movie);
      this.dataService.addMovie(movie, this.auth.isLoggedAs());
    } else{
      this.local.addMovieToFavsList(movie);
    }

  }

  removeFromFavorites(movie) {
    if (!this.local.usingLocalStorage()){
      this.dataService.removeFromFavorites(movie);
      this.dataService.deleteMovie(movie, this.auth.isLoggedAs());
    } else {
      this.local.removeMovieFromFavsList(movie);
    }

  }

  movieIsInFavorites(movieId): boolean {
    if (!this.local.usingLocalStorage()) {
      return this.dataService.movieIsInFavorites(movieId);
    } else {
      return this.local.movieIsInFavorites(movieId);
    }
  }

  movieIsNotInFavorites(movieId): boolean {
    if (!this.local.usingLocalStorage()) {
      return this.dataService.movieIsNotInFavorites(movieId);
    } else {
      return !this.local.movieIsInFavorites(movieId);
    }
  }
}
