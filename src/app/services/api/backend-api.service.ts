import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class BackendApiService {
  private environment = null;
  private endpoint = null;
  constructor(private http: HttpClient) {
    this.environment = JSON.parse(localStorage.getItem("APP_SETTINGS"));
    this.endpoint = this.environment.baseAPIUrl;
  }

  // public get(apiUrl: string, parameters?: object): Observable<any> {

  //   return this.http.get(endpoint + apiUrl, this.httpOptions(parameters)).pipe(
  //     map(this.extractData));
  // }

  private httpOptions(parameters?: object) {
    let headers = {
      "Content-Type": "application/json"
    };
    let token = localStorage.getItem(this.environment.localStorageJWT);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let httpHeaders = new HttpHeaders(headers);
    let params = new HttpParams();
    if (parameters) {
      for (let parameter in parameters) {
        params.append(parameter, parameters[parameter]);
      }
    }
    return {
      headers: httpHeaders
    };
  }

  private extractData(res: Response) {
    return res || {};
  }

  private generateQueryString(params?: object): string {
    if (params) {
      return (
        "?" +
        Object.keys(params)
          .map(key => key + "=" + params[key])
          .join("&")
      );
    }
    return "";
  }

  public get(apiUrl: string, parameters?: object): Observable<any> {
    return this.http
      .get(
        this.endpoint + apiUrl + this.generateQueryString(parameters),
        this.httpOptions()
      )
      .pipe(
        map(this.extractData),
        catchError((err: HttpErrorResponse) => {
          console.log(err);
          return of(false);
        })
      );
  }

  public post(apiUrl: string, data: any): Observable<any> {
    return this.http
      .post<any>(
        this.endpoint + apiUrl,
        JSON.stringify(data),
        this.httpOptions()
      )
      .pipe();
  }

  public patch(apiUrl: string, data: any): Observable<any> {
    return this.http
      .patch<any>(
        this.endpoint + apiUrl,
        JSON.stringify(data),
        this.httpOptions()
      )
      .pipe();
  }

  public update(apiUrl: string, data: any): Observable<any> {
    return this.http
      .put(this.endpoint + apiUrl, JSON.stringify(data), this.httpOptions())
      .pipe();
  }

  public delete(apiUrl: string): Observable<any> {
    return this.http
      .delete<any>(this.endpoint + apiUrl, this.httpOptions())
      .pipe();
  }
}
