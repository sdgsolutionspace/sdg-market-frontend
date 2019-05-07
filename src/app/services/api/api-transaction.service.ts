import { Injectable } from '@angular/core';
import { BackendApiService } from './backend-api.service';
import { Observable } from 'rxjs';
import { Transaction } from 'src/app/interfaces/transaction';
import { GitProject } from 'src/app/interfaces/git-project';

interface TransactionSearch {
  project?: number,
  from_user?: number,
  to_user?: number
}

@Injectable({
  providedIn: 'root'
})
export class ApiTransactionService {

  constructor(private backendApi: BackendApiService) { }

  public getAll(search: TransactionSearch): Observable<Array<Transaction>> {
    return this.backendApi.get("transactions", {
      "project": search.project ? search.project : null,
      "from_user": search.from_user ? search.from_user : null,
      "to_user": search.from_user ? search.from_user : null,
    });
  }

  public get(id: number): Observable<Transaction> {
    return this.backendApi.get(`transactions/${id}`);
  }

  public update(id: number, data: Transaction): Observable<Transaction> {
    return this.backendApi.update(`transactions/${id}`, data);
  }

  public create(data: Transaction): Observable<Transaction> {
    return this.backendApi.post(`transactions`, data);
  }

  public delete(id: number): Observable<any> {
    return this.backendApi.delete(`transactions/${id}`);
  }
}
