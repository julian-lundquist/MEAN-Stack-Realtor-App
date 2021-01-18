import { Component, OnInit } from '@angular/core';
import {PostService} from '../../shared/services/post.service';
import {Post} from '../../shared/classes/post';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  updateSpecificPost: boolean = false;

  constructor(public postService: PostService) { }

  ngOnInit(): void {
    this.postService.getPosts().subscribe(posts => {
      this.postService.posts = posts;
    });
  }

  updatePost(post: Post) {
    this.updateSpecificPost = true;
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId).subscribe(response => {
      if (response.n > 0) this.postService.posts = this.postService.posts.filter(post => post.id !== postId);
    });
  }

}
