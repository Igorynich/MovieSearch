import { Component, OnInit } from '@angular/core';
import {HttpService} from "../services/http.service";
import {FavoriteMovie} from "../classes/favorite-movie";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../services/data.service";
import {LocalStorageService} from "../services/local-storage.service";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  username: string;
  movieList: FavoriteMovie[];


  constructor(private httpService: HttpService, private route: ActivatedRoute, private dataService: DataService, private local: LocalStorageService) { }

  ngOnInit() {
    if (!this.local.usingLocalStorage()){
      this.username = this.route.snapshot.paramMap.get('username');
      this.httpService.getFavoriteMovies(this.username).subscribe((value:object[]) => {
        this.movieList = this.dataService.convertToFavoriteMoviesType(value);
        this.dataService.store(this.username, this.movieList);
      });
    } else{
      this.movieList = this.local.getFavoriteMovies();
    }

  }
  onMovieRemoval(e){                          //needed?
    if (!this.local.usingLocalStorage()){
      this.httpService.getFavoriteMovies(this.username).subscribe((value:object[]) => {
        this.movieList = this.dataService.convertToFavoriteMoviesType(value);
        this.dataService.store(this.username, this.movieList);
      });
    } else{
      this.movieList = this.local.getFavoriteMovies();
    }

  }

}
