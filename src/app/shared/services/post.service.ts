import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Post} from '../classes/post';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  posts: Post[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(): Observable<any> {
    return this.http.get<Post[]>('http://localhost:3000/api/posts').pipe(map(posts => {
      return posts.map(post => {
        return {
          // @ts-ignore converting _id to just id
          id: post._id,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath
        }
      });
    }));
  }

  getPost(postId: string): Observable<any> {
    return this.http.get<Post>('http://localhost:3000/api/posts/' + postId).pipe(map(post => {
      return {
        // @ts-ignore converting _id to just id
        id: post._id,
        title: post.title,
        content: post.content,
        imagePath: post.imagePath
      }
    }));
  }

  addPost(title: string, content: string, image: File | string) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image);
    console.log(image);

    this.http.post<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts', postData).subscribe(result => {
      console.log(result);
      const newPost = new Post();
      newPost.id = result._id;
      newPost.title = result.title;
      newPost.content =  result.content;
      newPost.imagePath = result.imagePath;
      this.posts.push(newPost);
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData = new FormData();
    postData.append('id', id);
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image);

    this.http.put('http://localhost:3000/api/posts/' + id, postData).subscribe(result => {
      console.log(result);
      this.router.navigate(['/posts']);
    });
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}
