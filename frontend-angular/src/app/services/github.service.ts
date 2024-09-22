import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private baseUrl = 'https://api.github.com/users/';

  constructor(private http: HttpClient) {}

  getUserProfile(username: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${username}`);
  }
}
