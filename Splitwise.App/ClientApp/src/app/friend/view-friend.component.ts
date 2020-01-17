import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../group/group.service';
import { ExpenseService } from '../expense/expense.service';
import { ExpenseData } from '../expense/expense-data';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { FriendExpenseData } from '../expense/friend-expense-data';

@Component({
  selector: 'app-view-friend',
  templateUrl: './view-friend.component.html',
  styleUrls: ['./view-friend.component.css']
})
export class ViewFriendComponent implements OnInit {
  userId: number;
  userName: string;
  friendId: number;
  expenseData: ExpenseData;
  errorMessage: any;
  friend: User;
  friendData: FriendExpenseData;
  setting: number = 1;
  netBal: number = 0;
  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private groupServeice: GroupService, private userService: UserService, private expenseService: ExpenseService, private router: Router) {
  }

  ngOnInit() {
    this.userId = +sessionStorage.getItem('userId');
    this.userName = sessionStorage.getItem('userName');
   
    this.activatedRoute.params.subscribe(
      params => {
        this.friendId = +params['friendId'];
        this.userService.GetUser(this.friendId).subscribe({
          next: friend => {
            this.friend = friend;
          },
          error: err => this.errorMessage = err,
        });
        this.expenseService.GetExpenseWithFriend(this.userId, this.friendId).subscribe({
          next: friendData => {
            this.friendData = friendData;
            let sum = 0;
            let length = Object.keys(friendData).length;
            for (let i = 0; i < length; i++) {
              sum += friendData[i]['paidAmount'];
            }
            this.netBal = sum;
          },
          error: err => this.errorMessage = err
        });
      }
    );
  }
}
