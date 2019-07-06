import { Component, OnInit } from '@angular/core';
import { User } from "../interfaces/user";
import { AuthService } from '../auth/auth.service';
import { ApiTransactionService } from '../services/api/api-transaction.service';
import { Transaction } from 'src/app/interfaces/transaction';
import { Contribution } from '../interfaces/contribution';
import { GitProject } from 'src/app/interfaces/git-project';



@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  public currentUser: User;
  public allTransaction: Array<Transaction>;
  public allContribution: Array<Transaction>;
  public currentProject: GitProject;

  constructor(private authService: AuthService, private transactionService: ApiTransactionService) { }

  ngOnInit() {
    this.currentUser = localStorage.getItem("CURRENT_USER") ? JSON.parse(localStorage.getItem("CURRENT_USER")) : null;
    this.authService.authenticationEvent.subscribe(user => {
      this.currentUser = user;
    });
    this.transactionService.getAll({
      from_user: this.currentUser.id
    }).toPromise().then(transactions => {
      this.allTransaction = transactions;
      this.allContribution = transactions.filter(to_user => to_user !== null);
    });
  }
}

