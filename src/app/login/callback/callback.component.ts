import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-callback',
    templateUrl: './callback.component.html',
    styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {
    public error: string;
    constructor(private auth: AuthService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        let self = this;
        const code: string = this.route.snapshot.queryParamMap.get('code');
        const state: string = this.route.snapshot.queryParamMap.get('state');
        this.auth.verifyCodeAndState(code, state)
            .subscribe(
                response => {
                    this.auth.logInUser(response);
                    this.router.navigate(['/auctions']);
                },
                error => {
                    // TODO: Better error handling

                    if (error.error && error.error.error_description) {
                        self.error = error.error.error_description;
                    }

                    if (error.error && error.error.message) {
                        self.error = error.error.message;
                    }
                });
    }

    connectGitHub() {
        this.auth.login();
    }

}
