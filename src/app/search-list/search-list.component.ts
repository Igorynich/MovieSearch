import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {HttpService} from "../services/http.service";
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss']
})
export class SearchListComponent implements OnInit, OnDestroy {

  searchParams;
  searchResponse;
  moviesArray;
  pageSuccLoaded:boolean;
  scrollToNextPageBound: () => void;

  constructor(private route: ActivatedRoute, private httpService: HttpService) { }

  ngOnInit() {

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.searchResponse = undefined;
      this.searchParams = {s: "", page: 1};

      params.keys.map((val: string, index: number) => {
        this.searchParams[val] = params.get(val);
      });

      if (this.searchParams.s) {
        this.httpService.searchForMovies(DataService.paramsReducer9000(this.searchParams)).subscribe(data => {

          this.searchResponse = data;
          this.moviesArray = this.searchResponse.Search;
          this.pageSuccLoaded = true;
          //console.log("SearchResp: ",this.searchResponse);
        });
      }
    });

    this.scrollToNextPageBound = this.scrollToNextPage.bind(this);
    window.addEventListener("scroll", this.scrollToNextPageBound);
  }

  ngOnDestroy(): void {
    window.removeEventListener("scroll", this.scrollToNextPageBound);
  }

  onMovieAddition(e){

  }


  scrollToNextPage() {

    let scrolled = window.pageYOffset || document.documentElement.scrollTop;
    //console.log("Scrolled111", scrolled);
    let scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
    //console.log("Scroll Height", scrollHeight);
    let windowHeight = window.innerHeight;
    //console.log("Window Height", windowHeight);
    if ((scrollHeight - windowHeight) == scrolled) {

      if ((this.searchResponse) && (this.searchResponse.totalResults>this.moviesArray.length+10) && (this.pageSuccLoaded)) {
        this.pageSuccLoaded = false;
        this.searchParams.page++;
        this.httpService.searchForMovies(DataService.paramsReducer9000(this.searchParams)).subscribe(data => {
          this.searchResponse = data;
          this.moviesArray.push(...this.searchResponse.Search);
          this.pageSuccLoaded = true;
        });

      }
    }
  }

}
