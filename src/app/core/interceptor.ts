import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(private router: Router) { 
    
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
    return next.handle(request);
  }
}