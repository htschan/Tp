// src/pages/profile/profile.ts

import { Events } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: "page-profile",
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {
  title: String = ' ';
  model = { name: "", password: "" };
  profile: any;

  // We need to inject AuthService so that we can
  // use it in the view
  constructor(public events: Events, public auth: AuthService) {
    events.subscribe('title:updated', (data) => {
      if (data.menuState) {
        this.title = "Projects";
      } else {
        this.title = ' ';
      }
    });
  }

  ngOnInit() {
    this.auth.getMyProfile().subscribe(profile => {
      this.profile = profile;
    })
  }

}
