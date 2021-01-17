import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  addPost(formData: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/posts', formData);
  }

}
