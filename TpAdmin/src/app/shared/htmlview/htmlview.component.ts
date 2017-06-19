import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'html-view',
  templateUrl: './htmlview.component.html',
  styleUrls: ['./htmlview.component.css']
})
export class HtmlViewComponent {
  fetchedHtml: any;

  constructor() { }

  trustSrcUrl = function (data) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(data);
  }
}

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
