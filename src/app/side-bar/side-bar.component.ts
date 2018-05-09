import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../services/data.service";
import {HttpService} from "../services/http.service";
import {MyErrorStateMatcher} from "../registration/registration.component";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  logged: boolean;
  loggedAs: string;
  redirectUrl: string = '/';
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  noSuchUserMessage: string = '';
  matcher = new MyErrorStateMatcher();


  constructor(private auth: AuthService, private router: Router, private dataService: DataService, private httpService: HttpService) {
  }

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.logged = this.auth.isLogged();
    this.loggedAs = this.auth.isLoggedAs();
  }

  logout() {
    this.dataService.setDataReady(false);
    this.auth.logout();
    this.noSuchUserMessage = '';
    this.router.navigate([this.redirectUrl]);
    this.checkLoginStatus();
  }

  login() {
    this.dataService.setDataReady(false);
    let credentials = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    };
    this.auth.authorize(credentials).subscribe(value => {

      if (!value){
        this.noSuchUserMessage = 'Ошибка авторизации';
      } else {
        this.httpService.getFavoriteMovies(credentials.username).subscribe((value:object[]) => {
          //console.log("MovieList while login: ", value);
          let movieList = this.dataService.convertToFavoriteMoviesType(value);
          this.dataService.store(credentials.username, movieList);
          this.dataService.setDataReady(true);
        });

        this.checkLoginStatus();
      }

    });

  }
}
