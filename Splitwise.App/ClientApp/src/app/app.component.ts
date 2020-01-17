import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { UserService } from './user/user.service';
import { GroupService } from './group/group.service';
import { GroupData } from './group/group-data';
import { User } from './user/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  userId: number;
  userName: string;
  groupData: GroupData[]=[];
  errorMessage: any;
  friendData: User[] = [];

  constructor(private groupServeice: GroupService, private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userId = +sessionStorage.getItem('userId');
    this.userName = sessionStorage.getItem('userName');
    //fetching groups
    this.groupServeice.GetGroupByUserId(this.userId).subscribe({
      next: groupData => {
        this.groupData = groupData;
      },
      error: err => this.errorMessage = err
    });
    //fetching friends 
    this.groupServeice.GetAllFriendsByUserId(this.userId).subscribe({
      next: friendData => {
        this.friendData = friendData;
      },
      error: err => this.errorMessage = err
    });
  }
}
