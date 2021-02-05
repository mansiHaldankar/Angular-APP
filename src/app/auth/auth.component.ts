import { Router } from '@angular/router';
import { authResponseData, AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error = null;

  constructor( private authservice: AuthService, private router: Router ) { }

  ngOnInit(): void {
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onAuthSubmit(form: NgForm){
    let email = form.value.email;
    let password = form.value.password;
    this.isLoading = true;

    let authObservable: Observable<authResponseData>;

    if(this.isLoginMode){
      authObservable = this.authservice.login(email, password);
    }
    else{
      authObservable = this.authservice.signUp(email, password);
    }

    authObservable.subscribe(respData => {
      console.log(respData);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    },
    errorResp => {
      this.error = errorResp;
      this.isLoading = false;
    });

    form.reset();
  }
}
