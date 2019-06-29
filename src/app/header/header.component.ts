import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public currentUser: User;

  constructor(public authGuard: AuthGuard, private authService: AuthService) { }

  ngOnInit() {
    this.currentUser = localStorage.getItem("CURRENT_USER") ? JSON.parse(localStorage.getItem("CURRENT_USER")) : null;
    this.authService.authenticationEvent.subscribe(user => {
      this.currentUser = user;
    });
  }

}
