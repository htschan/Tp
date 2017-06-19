import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  errorMsg = "";
  username: string;
  password: string;
  loginForm: FormGroup;
  error: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    // TimerObservable.create(1000).subscribe(t => {
    // });
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.error = '';
  }

  login(event) {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password)
        .subscribe(
        data => {
          this.error = "";
        },
        err => {
          this.error = JSON.parse(err._body).message;
        },
        () => console.log("complete")
        );
    }
  }
}
