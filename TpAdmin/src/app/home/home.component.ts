import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { TimepuncherService } from '../shared/services/timepuncher.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  today: any;

  constructor(private authService: AuthService, private tpService: TimepuncherService) {
  }
  ngOnInit() {
  }

  punchIn() {
    this.tpService.punchIn()
      .subscribe((punches) => {
        this.today = punches
      });
  }

  punchOut() {
    this.tpService.punchOut()
      .subscribe((punches) => {
        this.today = punches
      });
  }


  rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
  ];
  columns = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company' }
  ];
}
