import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {HttpService} from '../services/http.service';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss']
})
export class SearchListComponent implements OnInit, OnDestroy {

  searchParams;
  searchResponse;
  moviesArray = [];
  pageSuccLoaded = true;
  cardsInARow = 5;

  constructor(private route: ActivatedRoute, private httpService: HttpService) { }

  ngOnInit() {

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.searchResponse = undefined;
      this.searchParams = {s: '', page: 1};

      params.keys.map((val: string, index: number) => {
        this.searchParams[val] = params.get(val);
      });

      if (this.searchParams.s) {
        this.loadMovies();
      }
    });
  }

  ngOnDestroy(): void {
  }

  onMovieAddition(e){

  }

  loadMovies() {
    this.httpService.searchForMovies(DataService.paramsReducer9000(this.searchParams)).subscribe(data => {
      if (!data.Error) {
        if (+this.searchParams.page === 1) {
          this.moviesArray = [];
        }
        this.searchResponse = data;
        this.moviesArray = [...this.moviesArray, ...this.splitMoviesArrayIntoRows(this.searchResponse.Search)];
        console.log('this.moviesArray: ', this.moviesArray);
        this.pageSuccLoaded = true;
        console.log('SearchResp: ', this.searchResponse);
      }
    });
  }

  loadMoreMovies() {
    if (this.searchResponse && (this.searchResponse.totalResults > this.moviesArray.length + 10) && (this.pageSuccLoaded)) {
      this.pageSuccLoaded = false;
      this.searchParams.page++;
      this.loadMovies();
    }
  }

  splitMoviesArrayIntoRows(moviesArray: object[], moviesInARow = this.cardsInARow): any[] {
    if (moviesArray.length) {
      const result = [];
      for (let i = 0, j = moviesArray.length; i < j; i += moviesInARow) {
        result.push(moviesArray.slice(i, i + moviesInARow));
      }
      return result;
    }
    return [];
  }

}
