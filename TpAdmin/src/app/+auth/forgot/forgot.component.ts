import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styles: []
})
export class ForgotComponent implements OnInit {

  recoverForm: FormGroup;
  error: string;
  constructor(private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.recoverForm = this.formBuilder.group({
      email: ['', Validators.required]
    });

    this.error = '';
  }

  recover() {
    if (this.recoverForm.valid) {
      // Accounts.forgotPassword({
      //   email: this.recoverForm.value.email
      // }, (err) => {
      //   if (err) {
      //   } else {
      //     this.router.navigate(['/']);
      //   }
      // });
    }
  }
}
