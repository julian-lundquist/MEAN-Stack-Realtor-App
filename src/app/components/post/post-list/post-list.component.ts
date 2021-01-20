import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '../../../shared/services/post.service';
import {Post} from '../../../shared/classes/post';
import {PageEvent} from '@angular/material/paginator';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  postsPerPageOptions: number[] = [1, 2, 5, 10, 25];
  userIsAuthenticated: boolean = false;
  private authStatusSub: Subscription;

  constructor(public postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.postService.getPosts(this.postService.postsPerPage, this.postService.currentPage);
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
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
