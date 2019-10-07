import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Input } from '@angular/core';
import { GitProject } from 'src/app/interfaces/git-project';
import { User } from 'src/app/interfaces/user';
import { ApiTransactionService } from '../../services/api/api-transaction.service';
import { Transaction } from 'src/app/interfaces/transaction';

@Component({
  selector: 'app-table-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  public currentTransactions: Array<Transaction>;
  @Input("git-project") currentProject: GitProject;
  @Input("from_user") from_user: User;
  @Input("to_user") to_user: User;

  constructor(private transactionService: ApiTransactionService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.refreshTransactions();
  }

  public refreshTransactions() {
    if (this.currentProject || this.from_user) {
      this.transactionService.getAll({
        project: this.currentProject ? this.currentProject.id : null,
        from_user: this.from_user ? this.from_user.id : null,
      }).toPromise().then(transactions => {
        this.currentTransactions = transactions;
      });
    }
  }

  public getPreviousValue(id: number) {
    if (id !== 0) {
      if (this.currentTransactions[id - 1] && this.currentTransactions[id - 1].nb_sdg !== 0) {
        return this.currentTransactions[id - 1].nb_sdg / this.currentTransactions[id - 1].nb_tokens;
      } else {
        return this.getPreviousValue(id - 1);
      }
    }
    return this.currentTransactions[id] ? this.currentTransactions[id].nb_sdg / this.currentTransactions[id].nb_tokens : null;
  }

}
