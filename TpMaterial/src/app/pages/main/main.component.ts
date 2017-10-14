import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { ObservableMedia, MediaChange } from "@angular/flex-layout";
import { MatSidenav } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit, OnDestroy {

  @ViewChild("sidenav") sidenav: MatSidenav;
  isDarkTheme = false;
  mediaInfo = "";
  mediaSubscription: Subscription;

  constructor(public media: ObservableMedia) { }

  ngOnInit() {
    this.manageSidenav();
    this.mediaSubscription = this.media.asObservable().subscribe((change: MediaChange) => this.manageSidenav(change));
  }

  ngOnDestroy(): void {
    this.mediaSubscription.unsubscribe();
  }

  private manageSidenav(mediaChange?: MediaChange) {
    if (mediaChange) {
      this.mediaInfo = mediaChange.mediaQuery + ' mqAlias: ' + mediaChange.mqAlias;
    }
    if (this.media.isActive('(max-width: 599px)')) {
      this.loadMobileContent();
    } else
      if (this.media.isActive('(min-width: 600px)')) {
        this.loadDesktopContent();
      }
  }

  private loadMobileContent() {
    this.sidenav.close();
  }

  private loadDesktopContent() {
    this.sidenav.open();
  }
}
