import { Component, OnInit } from '@angular/core';
import {PostService} from '../../shared/services/post.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  postForm: FormGroup;
  postFormSubmitted: boolean = false;

  constructor(private postService: PostService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
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

    this.postService.addPost(this.postForm.value).subscribe((data) => {
      console.log(data);
    });

    // console.log(this.postForm.value);
    // this.postForm.reset();
    // console.log(this.postForm.value);
  }

}
