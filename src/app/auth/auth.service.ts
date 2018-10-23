import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from "../services/api/user.service";
import { User } from '../interfaces/user';

@Injectable()
export class AuthService {
    public authenticationEvent: EventEmitter<User> = new EventEmitter();
    private environment;
    constructor(private router: Router, private http: HttpClient, private userService: UserService) {
        this.refreshUser();
        this.environment = JSON.parse(localStorage.getItem("APP_SETTINGS"));
    }

    login() {
        let url = `${this.environment.githubAuth.URL}?scope=${this.environment.githubAuth.SCOPE}`;
        url += `&state=${this.generateRandomState()}&response_type=code&approval_prompt=auto`;
        url += `&redirect_uri=${this.environment.githubAuth.REDIRECT_URI}&client_id=${this.environment.githubAuth.CLIENT_ID}`;

        window.location.href = url;
    }

    verifyCodeAndState(code, state): Observable<any> {
        const url = this.environment.baseAPIUrl + '/connect/github/check';
        return this.http.get(`${url}?code=${code}&state=${state}`);
    }

    logout() {
        localStorage.removeItem(this.environment.localStorageJWT);
        localStorage.removeItem("CURRENT_USER");
        this.authenticationEvent.emit(null);
    }

    logInUser(response) {
        localStorage.setItem(this.environment.localStorageJWT, response.token);
        this.refreshUser();
    }

    refreshUser() {
        console.log("refreshing user");
        this.userService.getMe().toPromise().then(user => {
            this.authenticationEvent.emit(user);
            if (user) {
                localStorage.setItem("CURRENT_USER", JSON.stringify(user));
            } else {
                this.logout();
            }

        }).catch(err => {
            console.log("authentication error");
        });
    }

    generateRandomState() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

}
