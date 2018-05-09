import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {map, startWith} from 'rxjs/operators';
import {Observable} from "rxjs/Observable";
import {HttpService} from "../services/http.service";
import {Router} from "@angular/router";
import {DataService} from "../services/data.service";


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {


  search = new FormControl();
  filteredOptions;
  movies;
  searchReqParams = {s: '', page: 1};


  constructor(private httpService: HttpService, private router: Router) {
  }

  ngOnInit() {
    this.searchReqParams = {s: '', page: 1};
  }


  searchValueChanged() {
    if (this.search.value.length > 0) {
      let requestParams = {s: this.search.value};

      this.filteredOptions = this.httpService.searchForMovies(DataService.paramsReducer9000(requestParams)).pipe(map((value: { Search }) => {
        if ('Search' in value)
          this.movies = value.Search.slice();
        return this.movies;
      }));
    } else {
      this.filteredOptions = undefined;
    }
  }

  onSubmit(movieTitle?) {
    this.searchReqParams = {s: movieTitle ? movieTitle : this.search.value, page: 1};
    this.router.navigate(['/search'], {queryParams: this.searchReqParams});
    this.searchReqParams.s='';
    return false;
  }

}
