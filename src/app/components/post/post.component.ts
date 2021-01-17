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
    this.postService.getPosts().subscribe(data => {
      this.posts = data.posts;
      console.log(this.posts);
    });

    this.postForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required])
    })
  }

  get postF() { return this.postForm.controls; }

  public addPost() {
    this.postFormSubmitted = true;

    // stop here if form is invalid
    if (this.postForm.invalid) {
      return;
    }

    this.postService.addPost(this.postForm.value).subscribe(() => {
      this.postForm.reset();
    });

    // console.log(this.postForm.value);
    // this.postForm.reset();
    // console.log(this.postForm.value);
  }

}
