import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PostService} from '../../../shared/services/post.service';
import {Post} from '../../../shared/classes/post';
import {ActivatedRoute, Router} from '@angular/router';
import {mimeType} from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  postForm: FormGroup;
  post: Post;
  postId: string;
  imagePreview: string | ArrayBuffer;
  postFormSubmitted: boolean = false;
  updateSpecificPost: boolean = false;
  isLoading: boolean = false;

  constructor(public postService: PostService, private formBuilder: FormBuilder, public route: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
      image: new FormControl('',[Validators.required])
    });

    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('postId')) {
        this.updateSpecificPost = true;
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(post => {
          this.isLoading = false;
          this.post = post;
          if (this.post?.id) {
            this.postForm.get('title').setValue(this.post.title);
            this.postForm.get('content').setValue(this.post.content);
            this.postForm.get('image').setValue(this.post.imagePath);
            this.imagePreview = this.post.imagePath;
          } else {
            this.imagePreview = null;
          }
        });
      }
    });
  }

  get postF() { return this.postForm.controls; }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({image: file});
    this.postForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.imagePreview = reader.result;
    }
  }

  savePost() {
    this.postFormSubmitted = true;

    // stop here if form is invalid
    if (this.postForm.invalid) {
      return;
    }

    if (this.updateSpecificPost == true) {
      this.postService.updatePost(this.postId, this.postForm.value.title, this.postForm.value.content, this.postForm.value.image);
      document.getElementById("imageFilePicker").innerText = null;
      this.imagePreview = null;
    } else {
      this.postService.addPost(this.postForm.value.title, this.postForm.value.content, this.postForm.value.image);
      document.getElementById("imageFilePicker").innerText = null;
      this.imagePreview = null;
    }

    this.postFormSubmitted = false;
    this.postForm.reset();
  }
}
