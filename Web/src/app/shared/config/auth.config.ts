import { AuthConfig } from 'angular-oauth2-oidc';
import { AppConfig } from './app.config';

export function authConfig(url: string): AuthConfig {
    // const url = `${this.document.location.protocol}//${this.document.location.host}`;

    // let a = new AuthConfig();
    // a.
    return {
        // Url of the Identity Provider
        issuer: AppConfig.apiUrl + '/', // 'http://localhost:57310/', //
        // URL of the SPA to redirect the user to after login
        redirectUri: url, // 'http://localhost:4200/',
        // The SPA's id. The SPA is registered with this id at the auth-server
        clientId: 'WebApp',
        tokenEndpoint:  AppConfig.apiUrl + '/connect/token',
        // 'http://localhost:57310/connect/token', 'http://localhost:57310/connect/authorize',
        requireHttps: false,
        // set the scope for the permissions the client should request
        // The first three are defined by OIDC.
        scope: 'openid profile email offline_access roles', // client_id scope causes refresh_token error


        // oidc: false,



    };

}
