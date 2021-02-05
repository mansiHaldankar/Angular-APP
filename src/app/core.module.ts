import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthInterceptorInterceptor } from './auth/auth-interceptor.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi: true } ]
})
export class CoreModule { }
