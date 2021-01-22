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
  postsPerPage: number = 2;
  currentPage: number = 1;
  totalPosts: number;

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&currentPage=${currentPage}`
    return this.http.get<{posts: Post[], totalCount: number}>('http://localhost:3000/api/posts' + queryParams).pipe(map(postData => {
      return {
        posts: postData.posts.map(post => {
          return {
            // @ts-ignore converting _id to just id
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
            creatorId: post.creatorId
          }
        }),
        totalCount: postData.totalCount
      }
    })).subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.totalPosts = transformedPostData.totalCount;
    });
  }

  getPost(postId: string): Observable<any> {
    return this.http.get<Post>('http://localhost:3000/api/posts/' + postId).pipe(map(post => {
      return {
        // @ts-ignore converting _id to just id
        id: post._id,
        title: post.title,
        content: post.content,
        imagePath: post.imagePath,
        creatorId: post.creatorId
      }
    }));
  }

  addPost(title: string, content: string, image: File | string) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image);

    return this.http.post<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts', postData).subscribe(post => {
      this.getPosts(this.postsPerPage, this.currentPage);
      this.router.navigate(['/posts']);
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
