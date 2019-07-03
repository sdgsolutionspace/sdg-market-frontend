import { Component, OnInit } from '@angular/core';
import { User } from "../interfaces/user";
import { AuthService } from '../auth/auth.service';
import { ApiTransactionService } from '../services/api/api-transaction.service';
import { Transaction } from 'src/app/interfaces/transaction';
import { Contribution } from '../interfaces/contribution';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  public currentUser: User;
  public allTransaction: Transaction;
  public allContribution: Contribution;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.currentUser = localStorage.getItem("CURRENT_USER") ? JSON.parse(localStorage.getItem("CURRENT_USER")) : null;
    this.authService.authenticationEvent.subscribe(user => {
      this.currentUser = user;
    })
      ;

  }

}
