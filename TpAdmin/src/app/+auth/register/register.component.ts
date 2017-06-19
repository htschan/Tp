import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { ProfileService } from '../../shared/services/profile.service';

function emailChecker(c: AbstractControl) {
  let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  return EMAIL_REGEXP.test(c.value) ? null : {
    validateEmail: {
      valid: false
    }
  };
}

function passwordMatcher(c: AbstractControl) {
  return c.get('password').value === c.get('confirmPassword').value
    ? null : { 'nomatch': true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {
  signupForm: FormGroup;
  error: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService,
    private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      firstName: '',
      name: '',
      account: this.fb.group({
        email: ['', emailChecker],
        username: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      }, { validator: passwordMatcher })
    });
  }

  ngOnInit() {
  }

  register(event) {
    event.preventDefault();
    let val = this.signupForm.getRawValue();
    // this.authService.register(val.account.email, val.account.password, val.firstName, val.name).then(() => {
    //   this.router.navigate(['/home'])
    // }).catch((error: Error) => {
    //   this.errorMsg = error.message;
    // });
  }
}
