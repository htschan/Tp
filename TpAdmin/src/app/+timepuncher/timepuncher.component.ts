import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TimepuncherService } from '../shared/services/timepuncher.service';
import { User } from '../shared/model/user';

@Component({
  selector: 'app-timepuncher',
  templateUrl: './timepuncher.component.html',
  styleUrls: ['./timepuncher.component.css']
})
export class TimepuncherComponent implements OnInit {
  users: User[];
  selectedUser: User;

  constructor(private router: Router, private timepuncherService: TimepuncherService) { }

  ngOnInit() {
    this.timepuncherService.getUsers().subscribe(data => {
      console.log(data);
      this.users = data;
    });
  }

  gotoDetail() {

  }

  addUser() {
    this.timepuncherService.test();
  }

  onSelect(user: User) {
    this.selectedUser = user;
  }
}
