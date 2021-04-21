import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {User} from '../../../shared/classes/user';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  signupForm: FormGroup;
  isLoading: boolean = false;
  signupFormSubmitted: boolean = false;
  emailNotUnique: boolean = false;
  emailMessageError: string;
  private authStatusSub: Subscription;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phoneNum: new FormControl('', [Validators.required]),
      email: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]}),
      password: new FormControl('', [Validators.required]),
    });

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
        this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  get signupF() { return this.signupForm.controls; }

  signupSubmit() {
    this.signupFormSubmitted = true;

    if (this.signupForm.invalid) {
      return;
    }

    const oldUser = {
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      phoneNum: this.signupForm.value.phoneNum,
      email: this.signupForm.value.email
    }

    this.authService.createUser(
      this.signupForm.value.firstName,
      this.signupForm.value.lastName,
      this.signupForm.value.phoneNum,
      this.signupForm.value.email,
      this.signupForm.value.password
    ).subscribe(response => {
      if (response.message?.toString().includes(oldUser.email)) {
        this.emailNotUnique = true;
        this.emailMessageError = response.message?.text;
        this.signupFormSubmitted = false;
      } else {
        this.emailNotUnique = false;
        this.emailMessageError = null;
        this.signupFormSubmitted = false;
        this.router.navigate(['/login']);
      }
    }, error => {
      this.isLoading = false;
    });

    this.signupForm.reset();
  }

}
