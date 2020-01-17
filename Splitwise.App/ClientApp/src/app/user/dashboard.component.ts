import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { GroupData } from '../group/group-data';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExpenseData } from '../expense/expense-data';
import { Expense } from '../expense/expense';
import { Balance } from './balance';
import { Currency } from './currency';
import { SplitType } from './split-type';
import { User } from './user';
import { Repayment } from '../expense/repayment';
import { GenericValidator } from '../shared/generic';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../group/group.service';
import { ExpenseService } from '../expense/expense.service';
import { ActivityService } from '../activity/activity.service';
import { Activity } from '../activity/activity';
import { RepaymentDetail } from '../expense/repayment-detail';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

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
  lentTotal: number = 0;
  paidTotal: number = 0;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  oweData: RepaymentDetail;
  paidData: RepaymentDetail;

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private groupServeice: GroupService, private expenseService: ExpenseService, private router: Router, private activityService: ActivityService, private userService: UserService) {
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
    this.groupId = 0;

    this.expenseService.GetOwedExpenseWithAllFriend(this.userId).subscribe({
      next: oweData => {
        this.oweData = oweData;
      },
      error: err => this.errorMessage = err
    });

    this.expenseService.GetPaidExpenseWithAllFriend(this.userId).subscribe({
      next: paidData => {
        this.paidData = paidData;
      },
      error: err => this.errorMessage = err
    });

    this.groupServeice.GetAllFriendsByUserId(this.userId).subscribe({
      next: userData => {
        this.users = userData;
      },
      error: err => this.errorMessage = err
    });

    this.groupServeice.GetGroupExpensesByGroupId(this.groupId, this.userId).subscribe({
      next: expenseData => {
        this.expenseData = expenseData;
        let lentSum = 0;
        let paidSum = 0;
        let length = Object.keys(expenseData).length;
        for (let i = 0; i < length; i++) {
          lentSum += expenseData[i]['lentTotal'];
          paidSum += expenseData[i]['paidTotal'];
        }
        this.lentTotal = lentSum;
        this.paidTotal = paidSum;
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
    console.log(this.addExpenseForm);
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

              let sharedAmount = +parseFloat((u.ExpenseAmount / 2).toFixed(2));
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
              let repayment = <Repayment>{};
              repayment.ExpenseId = expenseData['expenseId'];
              repayment.From = u.Users;
              repayment.To = u.PaidBy;
              repayment.Amount = sharedAmount;
              repayment.CreatedAt = new Date().toDateString();
              repayment.IsActive = true;
              this.expenseService.AddRepayment(repayment).subscribe({
                next: repayment => {
                  let balance = <Balance>{};
                  balance.UserId = u.Users;
                  balance.PaidShare = 0;
                  balance.OwedShare = (sharedAmount);
                  balance.NetBalance = Math.round(balance.PaidShare - balance.OwedShare);
                  balance.Modified = new Date().toString();
                  balance.CreatedAt = new Date().toString();
                  balance.ExpenseId = expenseData['expenseId'];
                  balance.IsActive = true;
                  this.AddBalance(balance);
                  let activity = <Activity>{};
                  activity.ActivityDetails = `"${this.userName}" Added "${u.ExpenseName}"`;
                  activity.UserId = this.userId;
                  activity.GroupId = u.GroupId;
                  activity.CreatedAt = new Date().toString();
                  console.log(activity);
                  this.AddActivity(activity);
                },
                error: err => this.errorMessage = err
              });
            }

          }

        },
        error: err => this.errorMessage = err
      }

      );
    }
  }

  OnSubmitAddSettleUp() {

    if (this.addSettleUpForm.valid) {

      const u = {
        ...this.expense, ...this.addSettleUpForm.value
      };
      console.log(u);
      u.PaidBy = this.userId;
      u.SplitType = 'NA';
      u.ExpenseName = "Payment";
      u.IsSettlement = true;
      u.CreatedBy = this.userId;
      u.Modified = new Date().toDateString();
      u.IsActive = true;
      console.log(u);
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
                let activity = <Activity>{};
                this.userService.GetUser(u.Users).subscribe({
                  next: user => {
                    console.log(user);
                    activity.ActivityDetails = `"${this.userName}" Paid to "${user['userName']}" `;
                    activity.UserId = this.userId;
                    activity.GroupId = u.GroupId;
                    activity.CreatedAt = new Date().toString();
                    this.AddActivity(activity);
                  },
                });
              },
              error: err => this.errorMessage = err
            });
          }
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


  onKey(value: number) { // without type info
    this.count = 0;
    console.log(value);
    this.count = +this.count + +value;
  }

  AddActivity(activity: Activity) {
    this.activityService.AddActivity(activity).subscribe({
      next: activity => { console.log("activity created!") },
      error: err => this.errorMessage = err
    });
  }
}

