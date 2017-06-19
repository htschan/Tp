import { Component, OnInit } from '@angular/core';
import { GroupService } from '../shared/services/group.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  constructor(private groupService: GroupService) {
  }

  ngOnInit() {
  }

}
