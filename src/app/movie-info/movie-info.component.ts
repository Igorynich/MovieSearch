import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from "@angular/router";
import {HttpService} from "../services/http.service";
import {FavoriteMovie} from "../classes/favorite-movie";
import {AuthService} from "../services/auth.service";
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.scss']
})
export class MovieInfoComponent implements OnInit {

  id:string;
  movie;
  noPosterSubLink = 'http://www.eurodiesel.com/images/img-not-found.gif';

  constructor(private route: ActivatedRoute, private httpService: HttpService, private auth: AuthService, private dataService: DataService) {
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
    this.dataService.addToFavorites(movie);
    this.dataService.addMovie(movie, this.auth.isLoggedAs());
  }

  removeFromFavorites(movie) {
    this.dataService.removeFromFavorites(movie);
    this.dataService.deleteMovie(movie, this.auth.isLoggedAs());
  }

  movieIsInFavorites(movieId): boolean {
    return this.dataService.movieIsInFavorites(movieId);

  }

  movieIsNotInFavorites(movieId): boolean {
    return this.dataService.movieIsNotInFavorites(movieId);

  }
}
