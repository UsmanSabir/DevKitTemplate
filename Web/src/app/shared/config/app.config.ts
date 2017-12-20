import { environment } from '../../../environments/environment';

export class AppConfig {
    static readonly apiUrl = environment.apiUrl || 'http://localhost:3310' ;
    static readonly apiAuthLoginUrl = AppConfig.apiUrl + '/api/account/authenticate';
    static readonly apiAuthLogOutUrl = AppConfig.apiUrl + '/api/account/logout';
    static readonly apiTestUrl = AppConfig.apiUrl + '/api/values';
}
