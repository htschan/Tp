import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) {

  }
  
  ngOnInit() {
  }
}
