import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Group } from '../group';
import { GroupService } from '../group.service';
import { Category } from '../category';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupUser } from '../group-user';
import { GroupData } from '../group-data';
import { User } from '../../user/user';
import { UserService } from '../../user/user.service';
import { Subscription } from 'rxjs/Subscription';
import { GenericValidator } from '../../shared/generic';
import { Location } from '@angular/common';
import { Friend } from '../../user/friend';
import { Observable } from 'rxjs/Observable';
import { Activity } from '../../activity/activity';
import { ActivityService } from '../../activity/activity.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {
  addForm: FormGroup;
  userName: string;
  userId: number;
  groupId: number;
  group: Group;
  user: User;
  groupData: GroupData;
  groupUser: GroupUser;
  rows: FormArray;
  itemForm: FormGroup;
  categories: Category[] = [];
  errorMessage: any;
  private sub: Subscription;
  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder, private groupServeice: GroupService, private userService: UserService, private router: Router, private route: ActivatedRoute, private location: Location, private activityService: ActivityService) {
    this.validationMessages = {
      GroupName: {
        required: 'Group name is required.',
        minlength: 'Group name must be at least three characters.',
        maxlength: 'Group name cannot exceed 50 characters.'
      },
      GroupCategory: {
        required: 'Category is required.'
      },
      starRating: {
        range: 'Rate the product between 1 (lowest) and 5 (highest).'
      }
    }

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.rows = this.fb.array([]);
  }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      GroupName: ['', [Validators.required,
                       Validators.minLength(3),
                       Validators.maxLength(50)
                ]],
      GroupCategory: ['', Validators.required],
      SimplifyDebts: [false, Validators.required]
    });
    this.userName = sessionStorage.getItem('userName');
    this.userId = +sessionStorage.getItem('userId');
    this.sub = this.route.paramMap.subscribe(
      params => {
        this.groupId = +params.get('groupId');
        this.getGroup(this.groupId);
      }
    );
   
    this.groupServeice.GetCategories().subscribe({
      next: category => {
        this.categories = category;
      },
      error: err => this.errorMessage = err
    });


  }
  getGroup(groupId: number): void {
    this.groupServeice.GetGroupByGroupId(groupId)
      .subscribe({
        next: (groupData: GroupData) => { this.groupData = groupData, this.displayGroup(groupData) },
        error: err => this.errorMessage = err
      });
  }

  displayGroup(groupData: GroupData): void {
    
    if (this.addForm) {
      this.addForm.reset();
    }
    this.groupData = groupData;
    console.log(this.groupData[0].groupCategory);
    // Update the data on the form
    this.addForm.patchValue({
      GroupName: this.groupData[0].groupName,
      GroupCategory: this.groupData[0].groupCategory,
      SimplifyDebts: this.groupData[0].simplifyDebts
    });
  }

  onAddRow() {
    this.addForm.addControl('rows', this.rows);
    this.rows.push(this.createItemFormGroup());
  }

  onRemoveRow(rowIndex: number) {
    this.rows.removeAt(rowIndex);
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      name: null,
      emailAddress: null
    });
  }

  OnSubmit() {
    if (this.groupId == 0) {
      let groupId;
      const u = {
        ...this.group, ...this.addForm.value
      };

    u.CreatedBy = this.userId;
    u.IsActive = true;
    u.GroupLink = "/group-list";
    u.CreatedAt = new Date().toLocaleDateString();
    u.Modified = new Date().toLocaleDateString();

      // Add group
      this.groupServeice.AddGroup(u).subscribe(
        groupData =>
        {
          this.groupData = groupData;
          groupId = this.groupData['groupId'];
          let grpuser = <GroupUser>{};

          grpuser.UserId = this.userId;
          grpuser.GroupId = groupId;
          grpuser.IsActive = true;
          grpuser.CreatedAt = new Date().toLocaleDateString();
          // Add group user who is created group
          this.groupServeice.AddGroupUser(grpuser).subscribe(
            groupUser => {
              console.log(JSON.stringify(groupUser));
            },
            error => this.errorMessage = error as any
          );

          // other users 
          for (let i = 0; i < u.rows.length; i++)
          {
            if (u.rows[i].name != "" && u.rows[i].emailAddress != "") {
              // check user already exist 
              this.groupServeice.CheckUserByEmail(u.rows[i].emailAddress).subscribe(
                user => {
                  //if user exist then only add in group user
                  if (user != null) {
                    grpuser.UserId = user['userId'];
                    grpuser.GroupId = groupId;
                    grpuser.IsActive = true;
                    grpuser.CreatedAt = new Date().toLocaleDateString();
                    
                    this.groupServeice.AddGroupUser(grpuser).subscribe(
                      groupUser => {
                        console.log(JSON.stringify(groupUser));
                        // check friendship
                        let isFriends = this.CheckFriendship(this.userId, groupUser['userId']);
                        if (isFriends == false) {
                          this.AddFriend(this.userId, user['userId']);
                        }
                      },
                      error => this.errorMessage = error as any
                    );
                  }
                  //if user not exist in system then first add 
                  else {
                    let user = <User>{};
                    user.UserName = u.rows[i].name;
                    user.UserEmail = u.rows[i].emailAddress;
                    user.IsActive = true;
                    user.CreatedAt = new Date().toLocaleDateString();
                    user.Modified = new Date().toLocaleDateString();
                    this.userService.AddUser(this.user).subscribe(
                      user => {
                        grpuser.UserId = user.UserId;
                        grpuser.GroupId = this.groupData.GroupId;
                        grpuser.IsActive = true;
                        grpuser.CreatedAt = new Date().toLocaleDateString();
                        // Add in group user
                        this.groupServeice.AddGroupUser(grpuser).subscribe(
                          groupUser => {
                            console.log(JSON.stringify(groupUser));
                            // check friendship
                            let isFriends = this.CheckFriendship(this.userId, groupUser['userId']);
                            if (isFriends == false) {
                              this.AddFriend(this.userId, user.UserId);
                            }
                          },
                          error => this.errorMessage = error as any
                        );
                      },
                      error => this.errorMessage = error as any
                    );
                  }
                },
                error => this.errorMessage = error as any
              );
            }
          }
          let activity = <Activity>{};
          activity.ActivityDetails = `"${this.userName}" created group "${this.groupData.GroupName}" `;
          activity.UserId = this.userId;
          activity.GroupId = this.groupId;
          activity.CreatedAt = new Date().toString();
          this.AddActivity(activity);
          this.router.navigate(['/view-group', this.groupId]);
        },
        error => this.errorMessage = error as any
      );
    }
    // update group 
    else {
      const u = {
        ...this.group, ...this.addForm.value
      };
      let grpuser = <GroupUser>{};
      u.GroupId = this.groupData[0].groupId;
      u.CreatedBy = this.groupData[0].createdById;
      u.GroupLink = this.groupData[0].groupLink;
      u.CreatedAt = this.groupData[0].createdAt;
      u.Modified = new Date().toLocaleDateString();
      u.IsActive = true;  

      this.groupServeice.UpdateGroup(this.groupId, u)
        .subscribe({
          next: user => {
            if (u.rows)
              for (let i = 0; i < u.rows.length; i++)
            {
              if (u.rows[i].name != "" && u.rows[i].emailAddress != "") {
                this.groupServeice.CheckUserByEmail(u.rows[i].emailAddress).subscribe(
                  user => {
                    if (user != null && user['userId'] != null ) {
                      grpuser.UserId = user['userId'];
                      grpuser.GroupId = this.groupId;
                      grpuser.IsActive = true;
                      grpuser.CreatedAt = new Date().toLocaleDateString();
                      this.groupServeice.AddGroupUser(grpuser).subscribe(
                        groupUser => {
                          console.log(JSON.stringify(groupUser));
                          // check friendship
                          let isFriends = this.CheckFriendship(this.userId, groupUser['userId']);
                          if (isFriends == 'false') {
                            this.AddFriend(this.userId, user['userId']);
                          }

                        },
                        error => this.errorMessage = error as any
                      );
                    }
                    else {  
                      let user = <User>{};
                      user.UserName = u.rows[i].name;
                      user.UserEmail = u.rows[i].emailAddress;
                      user.IsActive = true;
                      user.CreatedAt = new Date().toLocaleDateString();
                      user.Modified = new Date().toLocaleDateString();
                     
                      this.userService.AddUser(user).subscribe(
                        user1 => {
                          let grpuser = <GroupUser>{};
                          grpuser.UserId = user1["userId"];
                          grpuser.GroupId = this.groupId;
                          grpuser.IsActive = true;
                          grpuser.CreatedAt = new Date().toLocaleDateString();
                          this.groupServeice.AddGroupUser(grpuser).subscribe(
                            groupUser => {
                              console.log(JSON.stringify(groupUser));
                              // check friendship
                              var count = this.CheckFriendship(this.userId, groupUser['userId']);
                            },
                            error => this.errorMessage = error as any
                          );
                        },
                        error => this.errorMessage = error as any
                      );
                    }
                  },
                  error => this.errorMessage = error as any
                );
              }
              }
            let activity = <Activity>{};
            activity.ActivityDetails = `"${this.userName}" updated group "${this.group.GroupName}" `;
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

  DeleteGroup() {
    this.groupServeice.DeleteGroup(this.groupId)
      .subscribe(
        group => {
          this.groupServeice.DeleteGroupUser(this.groupId).subscribe(
            data => { 
              let activity = <Activity>{};
              activity.ActivityDetails = `"${this.userName}" deleted group "${this.group.GroupName}" `;
              activity.UserId = this.userId;
              activity.GroupId = this.groupId;
              activity.CreatedAt = new Date().toString();
              this.AddActivity(activity);
            },
            err => this.errorMessage = err
          );

          
        },
        err => this.errorMessage = err
    );
    this.router.navigate(['/dashboard']);
  }

  CheckFriendship(userId: number, friendId: number): any {
    var count;
    this.groupServeice.CheckFriendship(userId, friendId).subscribe(
      data => {
        if (data == 0) {
          this.AddFriend(userId, friendId);
        }
      },
      err => this.errorMessage = err
    );
    return count;
  }

  AddFriend(userId: number, friendId: number): void {
    let friend = <Friend>{};
    friend.userId = userId;
    friend.friendId = friendId;
    friend.CreatedAt = new Date().toString();
    friend.IsActive = true;
    this.groupServeice.AddFriend(friend).subscribe(
      data => {
        console.log(data);
      },
      err => this.errorMessage = err
    );
  }

  
  AddActivity(activity: Activity) {
    this.activityService.AddActivity(activity).subscribe({
      next: activity => { console.log("activity created!") },
      error: err => this.errorMessage = err
    });
  }
}
