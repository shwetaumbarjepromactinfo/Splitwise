import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { User } from './user';
import { GenericValidator } from '../shared/generic';
import { UserService } from './user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  registerForm: FormGroup;
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
      UserName: {
        required: 'User name field is required',
      },
      UserEmail: {
        required: 'User email address field is required',
      },
      UserPassword: {
        required: 'User password field is required'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.registerForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMesaage = this.genericValidator.processMessages(this.registerForm);
    });

  }
  ngOnInit() {

    this.registerForm = this.fb.group({
      UserName: ['', [Validators.required]],
      UserEmail: ['', [Validators.required]],
      UserPassword: ['', [Validators.required]]
    });
  }

  OnSave(): void {
    if (this.registerForm.valid) {
      const u = {
        ...this.user, ...this.registerForm.value
      };
      u.CreatedAt = new Date();
      u.Modified = new Date();
      u.IsActive = true;
      this.userService.AddUser(u)
        .subscribe(user => {
          this.router.navigate(['/login']);
        },
          error => this.errorMessage = error as any
        );
    }
  }
    onSaveComplete(): void {
      this.registerForm.reset();
      this.router.navigate(['login']);
  }

}

