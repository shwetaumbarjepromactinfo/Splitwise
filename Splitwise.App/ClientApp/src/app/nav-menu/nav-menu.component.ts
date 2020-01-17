import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  private sub: Subscription;
  userId: number;
  userName: string;
  constructor(private router: Router, private route: ActivatedRoute) {
    
  }
  ngOnInit() {
    this.userId = +sessionStorage.getItem('userId');
    this.userName = sessionStorage.getItem('userName');
    
  }

  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  LogOut() {
    window.sessionStorage.clear();
    console.log("Successfully Logout");
    this.router.navigate(['login'])
  }
  
}
