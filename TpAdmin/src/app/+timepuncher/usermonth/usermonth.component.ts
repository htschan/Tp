import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TimepuncherService } from '../../shared/services/timepuncher.service';
import { User } from '../../shared/model/user';
import { Punch } from '../../shared/model/punch';


@Component({
  selector: 'app-usermonth',
  templateUrl: './usermonth.component.html',
  styleUrls: ['./usermonth.component.css']
})
export class UsermonthComponent implements OnInit {
  userid: number;
  user: User;
  punches: Observable<any>;

  selectedYear: string = "2016";
  selectedMonth: string = "2";

  years = [
    {value: '2015', viewValue: '2015'},
    {value: '2016', viewValue: '2016'},
    {value: '2017', viewValue: '2017'}
  ];
  months = [
    {value: '1', viewValue: 'Jan'},
    {value: '2', viewValue: 'Feb'},
    {value: '3', viewValue: 'Mar'},
    {value: '4', viewValue: 'Apr'},
    {value: '5', viewValue: 'Mai'},
    {value: '6', viewValue: 'Jun'},
    {value: '7', viewValue: 'Jul'},
    {value: '8', viewValue: 'Aug'},
    {value: '9', viewValue: 'Sep'},
    {value: '10', viewValue: 'Okt'},
    {value: '11', viewValue: 'Nov'},
    {value: '12', viewValue: 'Dez'},
  ];

  constructor(
    private timepuncherService: TimepuncherService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe((params: Params) => {
      this.userid = params['userid'];
      this.getPunches();
    });

  }

  ngOnInit() {
  }

  getPunches() {
    this.punches = this.timepuncherService.getUserPunchesPerMonth(this.userid, +this.selectedYear, +this.selectedMonth);
  }


}
