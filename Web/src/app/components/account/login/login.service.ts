import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AppConfig } from '../../../app.config';
import {HttpClient} from '@angular/common/http';

export interface User{
  id?: string;
  name: string;
  username: string;
   password: string;
   token: string;
}

@Injectable()
export class LoginService {
  
  constructor(private config: AppConfig, 
     private httpClient: HttpClient) { }
  
     login(username: string, password: string, callback: () => void) {

      const body = {username: username, password: password };
      this.httpClient.post<User>(this.config.apiAuthLoginUrl, body)
      .subscribe(
          data=>{
            callback();
            console.log(data);
            if (data && data.token) {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('token', JSON.stringify(data.token));
          }
          },
          error=>{
            callback();
            console.error(error);
          });

        //  return this.http.post(this.config.apiAuthLoginUrl, { username: username, password: password })
        //      .map((response: Response) => {
        //          // login successful if there's a jwt token in the response
        //          let user = response.json();
        //          if (user && user.token) {
        //              // store user details and jwt token in local storage to keep user logged in between page refreshes
        //              localStorage.setItem('currentUser', JSON.stringify(user));
        //          }
        //      });
     }
  
     logout() {
         // remove user from local storage to log user out
         localStorage.removeItem('currentUser');
     }
  

}
