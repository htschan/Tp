import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-punchday',
  templateUrl: './punchday.component.html',
  styleUrls: ['./punchday.component.css']
})
export class PunchdayComponent implements OnInit {
  @Input()
  day: any;

  constructor() { }

  ngOnInit() {
  }

}
