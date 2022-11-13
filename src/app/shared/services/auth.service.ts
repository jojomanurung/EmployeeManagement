import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<any>(this.API + '/auth/login', {
      username,
      password,
    });
  }

  isAuthenticated() {
    const api$ = this.http
      .get<any>(this.API + '/api')
      .pipe(catchError((err) => of(err.error)));
    return lastValueFrom(api$);
  }

  setSession(authResult: any) {
    localStorage.setItem('access_token', authResult.access_token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
  }
}
