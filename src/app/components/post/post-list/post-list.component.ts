import { Component, OnInit } from '@angular/core';
import {PostService} from '../../../shared/services/post.service';
import {Post} from '../../../shared/classes/post';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  isLoading: boolean = false;
  postsPerPageOptions: number[] = [1, 2, 5, 10, 25];

  constructor(public postService: PostService) { }

  ngOnInit(): void {
    this.postService.getPosts(this.postService.postsPerPage, this.postService.currentPage);
  }

  onChangedPage(pageEvent: PageEvent) {
    this.postService.currentPage = pageEvent.pageIndex + 1;
    this.postService.postsPerPage = pageEvent.pageSize;
    this.postService.getPosts(this.postService.postsPerPage, this.postService.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(response => {
      this.isLoading = false;
      if (response.n > 0) this.postService.getPosts(this.postService.postsPerPage, this.postService.currentPage);
    });
  }

}
