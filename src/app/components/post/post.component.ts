import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PostService} from '../../shared/services/post.service';
import {Post} from '../../shared/classes/post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  postForm: FormGroup;
  posts: Post[] = [];
  postFormSubmitted: boolean = false;

  constructor(private postService: PostService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required])
    });

    this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
      console.log(this.posts);
    });
  }

  get postF() { return this.postForm.controls; }

  addPost() {
    this.postFormSubmitted = true;

    // stop here if form is invalid
    if (this.postForm.invalid) {
      return;
    }

    this.postService.addPost(this.postForm.value).subscribe(() => {
      this.postFormSubmitted = false;
      this.postForm.reset();
    });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId).subscribe(data => {
      console.log(data);
    });
  }

}
