import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginFormSubmitted: boolean = false;
  isLoading: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      phoneNum: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
      password: new FormControl('', [Validators.required]),
    });
  }

  get loginF() { return this.loginForm.controls }

  doLogin() {
    this.loginFormSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }
  }

}
