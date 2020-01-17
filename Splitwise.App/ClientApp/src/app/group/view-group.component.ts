import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from './group.service';
import { GroupData } from './group-data';
import { ExpenseData } from '../expense/expense-data';
import { Currency } from '../user/currency';
import { SplitType } from '../user/split-type';
import { User } from '../user/user';
import { Expense } from '../expense/expense';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GenericValidator } from '../shared/generic';
import { ExpenseService } from '../expense/expense.service';
import { Repayment } from '../expense/repayment';
import { Balance } from '../user/balance';
import { error } from 'protractor';
import { Activity } from '../activity/activity';
import { ActivityService } from '../activity/activity.service';

@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.css']
})
export class ViewGroupComponent implements OnInit {
  @ViewChild('counts') input: ElementRef; 
  groupId: number;
  groupData: GroupData;
  addExpenseForm: FormGroup;
  addSettleUpForm: FormGroup;
  expenseData: ExpenseData;
  expense: Expense;
  balance: Balance;
  currencyData: Currency[] = [];
  splitTypeData: SplitType[] = [];
  allGroupData: GroupData[] = [];
  users: User[] = [];
  repayment: Repayment;
  errorMessage: any;
  setting: number = 1;
  userId: number;
  userName: string;
  count: number = 0;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private groupServeice: GroupService, private expenseService: ExpenseService, private router: Router, private activityService: ActivityService) {
    this.validationMessages = {
      PaidBy: {
        required: 'User name is required.'
      },
      GroupId: {
        required: 'Group name is required.'
      },
      ExpenseName: {
        required: 'Name field is required.'
      },
      ExpenseAmount: {
        required: 'Amount field is required.'
      },
      Currency: {
        required: 'Currency field is required.'
      },
      ExpenseDate: {
        required: 'Date field is required.'
      },
      Notes: {
        required: 'Notes field is required.'
      },
      SplitType: {
        required: 'SplitType field is required.'
      },
      Users: {

      },
      SplitCount: {

      }

    }

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {
    
    this.userId = +sessionStorage.getItem('userId');
    this.userName = sessionStorage.getItem('userName');
    this.activatedRoute.params.subscribe(
      params => {
        this.groupId = +params['groupId'];
        this.groupServeice.GetGroupByGroupId(this.groupId).subscribe({
          next: groupData => {
            this.groupData = groupData;
            let j = 0;
            for (let i = 0; i < this.groupData[0]['users'].length; i++) {

              if (this.userId != this.groupData[0]['users'][i].userId) {

                this.users[j] = this.groupData[0]['users'][i];
                j++;
              }
            }
            console.log(this.users);
          },
          error: err => this.errorMessage = err
        });
        this.groupServeice.GetGroupExpensesByGroupId(this.groupId, this.userId).subscribe({
          next: expenseData => {
            this.expenseData = expenseData;
          },
          error: err => this.errorMessage = err
        });

        this.groupServeice.GetCurrency().subscribe({
          next: currencyData => {
            this.currencyData = currencyData;
          },
          error: err => this.errorMessage = err
        });

        this.groupServeice.GetSplitType().subscribe({
          next: splitTypeData => {
            this.splitTypeData = splitTypeData;
          },
          error: err => this.errorMessage = err
        });

        this.groupServeice.GetGroupByUserId(this.userId).subscribe({
          next: allGroupData => {
            this.allGroupData = allGroupData;
          },
          error: err => this.errorMessage = err
        });

      }
    );
    this.addExpenseForm = this.fb.group({
      PaidBy: ['', [Validators.required]],
      GroupId: ['', [Validators.required]],
      ExpenseName: ['', Validators.required],
      ExpenseAmount: ['', Validators.required],
      Currency: ['', Validators.required],
      ExpenseDate: ['', Validators.required],
      Notes: ['', Validators.required],
      SplitType: ['', Validators.required],
      Users: ['', Validators.required]
    });
    this.addSettleUpForm = this.fb.group({
      GroupId: ['', [Validators.required]],
      ExpenseAmount: ['', Validators.required],
      Currency: ['', Validators.required],
      ExpenseDate: ['', Validators.required],
      Notes: ['', Validators.required],
      Users: ['', Validators.required]
    });
  }

  OnSubmitAddExpense() {
    if (this.addExpenseForm.valid) {
      const u = {
        ...this.expense, ...this.addExpenseForm.value
      };
      u.CreatedBy = this.userId;
      u.Modified = new Date().toDateString();
      u.IsActive = true;
      u.ExpenseDate = new Date(u.ExpenseDate).toDateString()
      this.expenseService.AddExpense(u).subscribe({
        next: expenseData => {
          if (u.users == null) {
            if (u.SplitType === "Split equally") {

              let sharedAmount = +parseFloat((u.ExpenseAmount / this.groupData[0].users.length).toFixed(2));
              let paidUserBalance = <Balance>{};
              paidUserBalance.UserId = u.PaidBy;
              paidUserBalance.PaidShare = u.ExpenseAmount;
              paidUserBalance.OwedShare = Math.round(u.ExpenseAmount - sharedAmount);
              paidUserBalance.NetBalance = Math.round(paidUserBalance.PaidShare - paidUserBalance.OwedShare);
              paidUserBalance.Modified = new Date().toString();
              paidUserBalance.CreatedAt = new Date().toString();
              paidUserBalance.ExpenseId = expenseData['expenseId'];
              paidUserBalance.IsActive = true;
              this.AddBalance(paidUserBalance);
              for (let i = 0; i < this.groupData[0].users.length; i++) {
                if (u.PaidBy != this.groupData[0].users[i].userId) {
                  let repayment = <Repayment>{};
                  repayment.ExpenseId = expenseData['expenseId'];
                  repayment.From = this.groupData[0].users[i].userId;
                  repayment.To = u.PaidBy;
                  repayment.Amount = sharedAmount;
                  repayment.CreatedAt = new Date().toDateString();
                  repayment.IsActive = true;
                  this.expenseService.AddRepayment(repayment).subscribe({
                    next: repayment => {
                      let balance = <Balance>{};
                      balance.UserId = this.groupData[0].users[i].userId;
                      balance.PaidShare = 0;
                      balance.OwedShare = (sharedAmount);
                      balance.NetBalance = Math.round(balance.PaidShare - balance.OwedShare);
                      balance.Modified = new Date().toString();
                      balance.CreatedAt = new Date().toString();
                      balance.ExpenseId = expenseData['expenseId'];
                      balance.IsActive = true;
                      this.AddBalance(balance);
                      this.router.navigate(['/view-group', this.groupId]);
                    },
                    error: err => this.errorMessage = err
                  });
                }

              }
            }
          }

          let activity = <Activity>{};
          activity.ActivityDetails = `"${this.userName}" added expenses in "${this.groupData.GroupName}" `;
          activity.UserId = this.userId;
          activity.GroupId = this.groupId;
          activity.CreatedAt = new Date().toString();
          this.AddActivity(activity);
          location.reload();
        },
        error: err => this.errorMessage = err
      });
    }
  }

  OnSubmitAddSettleUp() {
    
    if (this.addSettleUpForm.valid) {

      const u = {
        ...this.expense, ...this.addSettleUpForm.value
      };
      u.PaidBy = this.userId;
      u.SplitType = 'NA';
      u.ExpenseName = "Payment";
      u.IsSettlement = true;
      u.CreatedBy = this.userId;
      u.Modified = new Date().toDateString();
      u.IsActive = true;
      u.ExpenseDate = new Date(u.ExpenseDate).toDateString()
      this.expenseService.AddExpense(u).subscribe({
        next: expenseData => {
          if (u.users == null) {
            let repayment = <Repayment>{};
            repayment.ExpenseId = expenseData['expenseId'];
            repayment.From = this.userId;
            repayment.To = u.Users;
            repayment.Amount = u.ExpenseAmount;
            repayment.CreatedAt = new Date().toDateString();
            repayment.IsActive = true;
            this.expenseService.AddRepayment(repayment).subscribe({
              next: repayment => {
                let balance = <Balance>{};
                balance.UserId = this.userId;
                balance.PaidShare = 0;
                balance.OwedShare = u.ExpenseAmount;
                balance.NetBalance = Math.round(balance.PaidShare - balance.OwedShare);
                balance.Modified = new Date().toString();
                balance.CreatedAt = new Date().toString();
                balance.ExpenseId = expenseData['expenseId'];
                balance.IsActive = true;
                balance.IsPaid = true;
                this.AddBalance(balance);
                let paidBalance = <Balance>{};
                paidBalance.UserId = u.Users;
                paidBalance.PaidShare = u.ExpenseAmount;
                paidBalance.OwedShare = 0;
                paidBalance.NetBalance = Math.round(balance.PaidShare - balance.OwedShare);
                paidBalance.Modified = new Date().toString();
                paidBalance.CreatedAt = new Date().toString();
                paidBalance.ExpenseId = expenseData['expenseId'];
                paidBalance.IsActive = true;
                paidBalance.IsPaid = false;
                this.AddBalance(paidBalance);
              },
              error: err => this.errorMessage = err
            });
          }
          let activity = <Activity>{};
          activity.ActivityDetails = `"${this.userName}" added settle up in "${this.groupData['groupName']}" `;
          activity.UserId = this.userId;
          activity.GroupId = this.groupId;
          activity.CreatedAt = new Date().toString();
          this.AddActivity(activity);
          location.reload();
        },
        error: err => this.errorMessage = err
      });
    }
  }

  AddBalance(balance: Balance) {
    this.expenseService.AddBalance(balance).subscribe({
      next: balance => { },
      error: err => this.errorMessage = err
    });
  }

  AddActivity(activity: Activity) {
    this.activityService.AddActivity(activity).subscribe({
      next: activity => { console.log("activity created!") },
      error: err => this.errorMessage = err
    });
  }
}
