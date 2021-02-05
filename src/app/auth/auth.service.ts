import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { User } from './user.model';

export interface authResponseData {
  idToken:	string,
  email:	string,
  refreshToken: string,
  expiresIn:	string,
  localId:	string
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor( private http: HttpClient, private router: Router ) { }

  signUp(email: string, password: string){
    return this.http.post<authResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD5_1E-QHC6XctSX6GWZ5fw8oxHFPuAZnM",
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(
      catchError(this.handleError),
      tap(respData => {
        this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
      })
    );
  }

  login(email: string, password: string){
    return this.http.post<authResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD5_1E-QHC6XctSX6GWZ5fw8oxHFPuAZnM',
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(
      catchError(this.handleError),
      tap(respData => {
        this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
      })
    );
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;

  }

  autoLogin(){
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if(!userData){
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if(loadedUser.token){
      this.user.next(loadedUser);
      const expirationDuration =
      new Date(userData._tokenExpirationDate).getTime() -
      new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, userId:string,
    token: string, expiresIn: number){
      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
      const user = new User(email, userId, token, expirationDate);
      this.user.next(user);
      this.autoLogout(expiresIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
  }
  private handleError(errorResp: HttpErrorResponse){
    let errorMessage = "An unknown error occured";

    if(!errorResp.error || !errorResp.error.error){
      return throwError(errorMessage);
    }

    switch (errorResp.error.error.message){
      case 'EMAIL_NOT_FOUND':
        errorMessage = "There is no user record corresponding to this identifier. The user may have been deleted."
        break;

      case 'INVALID_PASSWORD':
        errorMessage = "The password is invalid or the user does not have a password.";
        break;

      case 'USER_DISABLED':
        errorMessage = "The user account has been disabled by an administrator.";
        break;

      case 'EMAIL_EXISTS':
        errorMessage = 'The email address is already in use by another account.'
        break;

      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'Password sign-in is disabled for this project.'
        break;

      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.'
        break;
    }
      return throwError(errorMessage);
  }
}

