import { Component, OnInit } from '@angular/core';
import { MdIconRegistry, MdDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  users = [
    {
      name: 'Lia Lugo',
      avatar: 'svg-11',
      details: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage ' +
      'cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta ' +
      'who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue ' +
      'castello caerphilly chalk and cheese. Lancashire.',
      isAdmin: true,
      isCool: false
    }
  ]
  selectedUser = this.users[0];

  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private dialog: MdDialog) { }

  ngOnInit() {
  }

  openAdminDialog() {
    this.dialog.open(DialogComponent).afterClosed()
      .filter(result => !!result)
      .subscribe(user => {
        this.users.push(user);
        this.selectedUser = user;
      });
  }
}
