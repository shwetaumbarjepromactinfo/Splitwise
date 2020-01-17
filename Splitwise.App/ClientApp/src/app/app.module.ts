import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { UserComponent } from './user/user.component';
import { UserService } from './user/user.service';
import { RegisterComponent } from './user/register.component';
import { DashboardComponent } from './user/dashboard.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AddGroupComponent } from './group/add-group/add-group.component';
import { AddExpenseComponent } from './expense/add-expense.component';
import { GroupService } from './group/group.service';
import { ExpenseListComponent } from './expense/expense-list.component';
import { ViewGroupComponent } from './group/view-group.component';
import { ExpenseService } from './expense/expense.service';
import { AddFriendComponent } from './friend/add-friend.component';
import { ViewFriendComponent } from './friend/view-friend.component';
import { ViewActivityComponent } from './activity/view-activity.component';
import { ActivityService } from './activity/activity.service';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    UserComponent,
    RegisterComponent,
    DashboardComponent,
    AddGroupComponent,
    AddExpenseComponent,
    ExpenseListComponent,
    ViewGroupComponent,
    AddFriendComponent,
    ViewFriendComponent,
    ViewActivityComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: UserComponent, pathMatch: 'full' },
      { path: 'login', component: UserComponent, pathMatch: 'full' },
      { path: 'register', component: RegisterComponent, pathMatch: 'full' },
      { path: 'user/:userId', component: DashboardComponent },
      { path: 'add-group/0', component: AddGroupComponent },
      { path: 'edit-group/:groupId', component: AddGroupComponent },
      { path: 'view-group/:groupId', component: ViewGroupComponent },
      { path: 'expense-list', component: ExpenseListComponent },
      { path: 'add-expense/:group-Id', component: AddExpenseComponent },
      { path: 'view-friend/:friendId', component: ViewFriendComponent },
      { path: 'add-friend/0', component: AddFriendComponent },
      { path: 'edit-friend/:friendId', component: AddFriendComponent },
      { path: 'expense-list', component: ExpenseListComponent },
      { path: 'activities', component: ViewActivityComponent },
      { path: 'dashboard', component: DashboardComponent },

    ])
  ],
  providers: [UserService, GroupService, ExpenseService, ActivityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
