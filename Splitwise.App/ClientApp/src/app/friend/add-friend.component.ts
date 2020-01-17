import { Component, OnInit, ElementRef, ViewChildren } from '@angular/core';
import { GenericValidator } from '../shared/generic';
import { FormBuilder, FormGroup, Validators, FormControl, FormControlName } from '@angular/forms';
import { GroupService } from '../group/group.service';
import { UserService } from '../user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../user/user';
import { Friend } from '../user/friend';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { debounceTime } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Activity } from '../activity/activity';
import { ActivityService } from '../activity/activity.service';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.css']
})
export class AddFriendComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  addForm: FormGroup;
  userName: string;
  userId: number;
  friendId: number;
  user: User;
  friend: Friend;
  errorMessage: any;
  private sub: Subscription;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder, private groupServeice: GroupService, private userService: UserService, private router: Router, private route: ActivatedRoute, private activityService: ActivityService) {
    this.validationMessages = {
      UserName: {
        required: 'Name is required.',
        minlength: 'Name must be at least three characters.',
        maxlength: 'Name cannot exceed 50 characters.'
      },
      UserEmail: {
        required: 'Email address is required.'
      }
    }
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.addForm.valueChanges, ...controlBlurs)
      .pipe(
        debounceTime(800)
      ).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.addForm);
      });
  }

  ngOnInit() {
    this.addForm = this.fb.group({
      UserName: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
      ]],
      UserEmail: ['', [Validators.required]]//, this.isEmailUnique.bind(this)]
    });

    this.userName = sessionStorage.getItem('userName');
    this.userId = +sessionStorage.getItem('userId');
    this.sub = this.route.paramMap.subscribe(
      params => {
        this.friendId = +params.get('friendId');
        if (this.friendId != 0)
          this.getFriend(this.friendId);
      }
    );
  }

  getFriend(friendId: number): void {
    this.userService.GetUser(friendId)
      .subscribe({
        next: (user: User) => { this.user = user, this.displayUser(user) },
        error: err => this.errorMessage = err
      });
  }

  displayUser(user: User): void {

    if (this.addForm) {
      this.addForm.reset();
    }
   
    this.user = user;
    // Update the data on the form
    this.addForm.patchValue({
      UserName: this.user['userName'],
      UserEmail: this.user['userEmail']
    });
    
  }

  OnSave() {
    if (this.addForm.valid) {
      let friendData = <Friend>{};
      if (this.friendId == 0) {
        let groupId;
        const u = {
          ...this.user, ...this.addForm.value
        };
        u.CreatedAt = new Date().toString();
        u.Modified = new Date().toString();
        u.IsActive = true;
        this.userService.AddUser(u).subscribe({
          next: (user: User) => {
            friendData.userId = this.userId;
            friendData.friendId = user['userId'];
            friendData.CreatedAt = new Date().toString();
            friendData.IsActive = true;
            this.groupServeice.AddFriend(friendData).subscribe({
              next: (friend: Friend) => {
                    let activity = <Activity>{};
                    activity.ActivityDetails = `"${this.userName}" added "${user['userName']}" `;
                    activity.UserId = this.userId;
                    activity.GroupId = 0;
                    activity.CreatedAt = new Date().toString();
                this.AddActivity(activity);
                this.onSaveComplete(user['userId']);
              },
              error: err => this.errorMessage = err
            });
          },
          error: err => this.errorMessage = err
        });
      }
      else {
        const u = {
          ...this.user, ...this.addForm.value
        };
       
        this.userService.UpdateUser(this.friendId, u).subscribe({
          next: data => {
            let activity = <Activity>{};
            activity.ActivityDetails = `"${this.userName}" updated information of "${u.userName}" `;
            activity.UserId = this.userId;
            activity.GroupId = 0;
            activity.CreatedAt = new Date().toString();
            this.AddActivity(activity);
            location.reload();
          },
          error: err => this.errorMessage = err
        });
      }
    }
  }

  onSaveComplete(userId: number): void {
    this.addForm.reset();
    this.router.navigate(['/view-friend',userId]);
  }

 
  isEmailUnique(control: FormControl) {
    const q = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.groupServeice.isEmailRegisterd(control.value).subscribe(() => {
          resolve(null);
        }, () => { resolve({ 'isEmailUnique': true }); });
      }, 1000);
    });
    return q;
  }

  AddActivity(activity: Activity) {
    this.activityService.AddActivity(activity).subscribe({
      next: activity => { console.log("activity created!") },
      error: err => this.errorMessage = err
    });
  }
}
