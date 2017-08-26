import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ObservableMedia } from "@angular/flex-layout";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit {
  isDarkTheme = false;

  constructor(public media: ObservableMedia) { }

  ngOnInit() { }
}
