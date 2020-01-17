import { Component, OnInit } from '@angular/core';
import { ActivityService } from './activity.service';
import { Activity } from './activity';

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.css']
})
export class ViewActivityComponent implements OnInit {
  userId: number;
  userName: string;
  activityData: Activity[]=[];
  errorMessage: any;

  constructor(private activityService: ActivityService) { }

  ngOnInit() {
    this.userId = +sessionStorage.getItem('userId');
    this.userName = sessionStorage.getItem('userName');

    this.activityService.GetActivityByUserId(this.userId).subscribe({
      next: activityData => {
        this.activityData = activityData;
      },
      error: err => this.errorMessage = err
    });
  }

}
