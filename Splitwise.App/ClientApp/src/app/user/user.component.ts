import { Component, OnInit, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { User } from './user';
import { UserService } from './user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { debounceTime } from 'rxjs/operators';
import { GenericValidator } from '../shared/generic';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  userForm: FormGroup;
  private sub: Subscription;
  user: User;
  errorMessage: string;
  displayMesaage: { [key: string]: string } = {};
  private validationMessages: {
    [key: string]: { [key: string]: string }
  };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private route: ActivatedRoute) {
    this.validationMessages = {
      UserEmail: {
        required:'User email address field is required',
      },
      UserPassword: {
        required:'User password field is required'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {

    this.userForm = this.fb.group({
      UserEmail: ['', [Validators.required]],
      UserPassword: ['', [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.userForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMesaage = this.genericValidator.processMessages(this.userForm);
    });

  }
  OnSubmit() {
    if (this.userForm.valid) {
      const u = {
        ...this.user, ...this.userForm.value
      };

      this.userService.GetUserByUserEmail(u.UserEmail, u.UserPassword).subscribe(
        user => {
          sessionStorage.setItem('userId', user["userId"]);
          sessionStorage.setItem('userName', user["userName"]);
          this.router.navigate(['/user', user["userId"]]);
        },
        error => this.errorMessage = error as any
      );

    }
  }

}
