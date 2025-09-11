import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');
    
    console.log('Interceptor running for URL:', req.url);
    console.log('Token found:', token ? 'YES' : 'NO');
    
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      console.log('Added Authorization header:', authReq.headers.get('Authorization'));
      return next.handle(authReq);
    }
    
    console.log('No token - request sent without auth');
    return next.handle(req);
  }
}