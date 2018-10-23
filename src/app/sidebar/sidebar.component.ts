import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../interfaces/user';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public currentUser: User;

  constructor(public authGuard: AuthGuard, public authService: AuthService) { }

  ngOnInit() {
    this.currentUser = localStorage.getItem("CURRENT_USER") ? JSON.parse(localStorage.getItem("CURRENT_USER")) : null;
    this.authService.authenticationEvent.subscribe(user => {
      this.currentUser = user;
    });
  }

}
