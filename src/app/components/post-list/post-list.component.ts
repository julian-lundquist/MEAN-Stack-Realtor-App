import { Component, OnInit } from '@angular/core';
import {PostService} from '../../shared/services/post.service';
import {Post} from '../../shared/classes/post';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  isLoading: boolean = false;

  constructor(public postService: PostService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts().subscribe(posts => {
      this.isLoading = false;
      this.postService.posts = posts;
    });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(response => {
      this.isLoading = false;
      if (response.n > 0) this.postService.posts = this.postService.posts.filter(post => post.id !== postId);
    });
  }

}
