import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PostService} from '../../shared/services/post.service';
import {Post} from '../../shared/classes/post';
import {ActivatedRoute, Router} from '@angular/router';

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
      imagePath: new FormControl('')
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
            this.postForm.get('imagePath').setValue(this.post.imagePath);
            this.imagePreview = this.post.imagePath;
          }
        });
      }
    });
  }

  get postF() { return this.postForm.controls; }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({imagePath: file});
    this.postForm.get('imagePath').updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.imagePreview = reader.result;
    }

    console.log(this.postForm.get('imagePath').value);
    console.log(this.postForm);
  }

  savePost() {
    this.postFormSubmitted = true;

    // stop here if form is invalid
    if (this.postForm.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.updateSpecificPost == true) {
      this.post.title = this.postForm.get('title').value;
      this.post.content = this.postForm.get('content').value;
      this.post.imagePath = this.postForm.get('imagePath').value;

      this.postService.updatePost(this.post).subscribe(result => {
        this.isLoading = false;
        if (result.n > 0 && result.nModified > 0) {
          let index = this.postService.posts.findIndex(post => post.id === this.post.id);
          this.postService.posts[index] = this.post;
        }

        this.postFormSubmitted = false;
        this.postForm.reset();
        this.router.navigate(['/posts']);
      });
    } else {
      this.postService.addPost(this.postForm.value).subscribe(result => {
        console.log(result);
        this.isLoading = false;
        const newPost = new Post();
        newPost.id = result._id;
        newPost.title = result.title;
        newPost.content =  result.content;
        newPost.imagePath = result.imagePath;
        this.postService.posts.push(newPost);

        this.imagePreview = null;
        this.postFormSubmitted = false;
        this.postForm.reset();
      });
    }
  }
}
