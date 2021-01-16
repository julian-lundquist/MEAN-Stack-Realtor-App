import { Component, OnInit } from '@angular/core';
import {PostService} from './service/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  constructor(public postService: PostService) { }

  ngOnInit(): void {
  }

}
