import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Post} from '../classes/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  posts: Post[] = [];

  constructor(private http: HttpClient) { }

  getPosts(): Observable<any> {
    return this.http.get<Post[]>('http://localhost:3000/api/posts').pipe(map(posts => {
      return posts.map(post => {
        return {
          // @ts-ignore converting _id to just id
          id: post._id,
          title: post.title,
          content: post.content
        }
      });
    }));
  }

  findPost(postId: string): Post {
    return {...this.posts.find(p => p.id === postId)}
  }

  addPost(postData: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/posts', postData);
  }

  updatePost(post: Post): Observable<any> {
    return this.http.put('http://localhost:3000/api/posts/' + post.id, post);
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}
