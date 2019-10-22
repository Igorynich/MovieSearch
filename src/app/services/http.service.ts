import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {FavoriteMovie} from '../classes/favorite-movie';
import {catchError, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable()
export class HttpService {

  private apiLink = 'http://www.omdbapi.com/?apikey=d81562b3&';
  private db = 'http://localhost:3000';
  private retryCount = 3;

  constructor(private http: HttpClient) {
  }

  searchForMovies(params: string) {
    return this.http.get(this.apiLink + params).pipe(
      retry(this.retryCount),
      catchError(this.handleError));
  }

  addMovieToFavorites(movie: FavoriteMovie) {
    return this.http.post(this.db + '/favorites', movie).pipe(
      retry(this.retryCount),
      catchError(this.handleError));
  }

  getFavoriteMovies(username) {
    return this.http.get(this.db + '/favorites/' + username).pipe(
      retry(this.retryCount),
      catchError(this.handleError));;
  }

  removeFromFavorites(username: string, movie_id: string) {
    return this.http.delete(this.db + '/favorites/' + username + '/' + movie_id).pipe(
      retry(this.retryCount),
      catchError(this.handleError));
  }

  /*registerNewUser(credentials){       //Basic a
    const headers = credentials ?
      new HttpHeaders().set('Authorization', 'Basic ' + btoa(credentials.username + ':' + credentials.password)) : {};
    return this.http.post(this.db+ "/auth", {username: credentials.username}, {headers: headers});
  }

  findUser(credentials){          //Basic a
    const headers = credentials ?
      new HttpHeaders().set('Authorization', 'Basic ' + btoa(credentials.username + ':' + credentials.password)) : {};
    return this.http.get(this.db+ "/auth/"+credentials.username, {headers: headers});
  }*/

  registerNewUser(credentials) {

    return this.http.post(this.db + '/auth/regnew', credentials).pipe(
      retry(this.retryCount),
      catchError(this.handleError));
  }

  findUser(credentials) {

    return this.http.post(this.db + '/auth', credentials).pipe(
      retry(this.retryCount),
      catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}
