export class AppConfig {
    static readonly apiUrl = 'http://localhost:57310';
    static readonly apiAuthLoginUrl = AppConfig.apiUrl + '/api/account/authenticate';
    static readonly apiAuthLogOutUrl = AppConfig.apiUrl + '/api/account/logout';
    static readonly apiTestUrl = AppConfig.apiUrl + '/api/values';
}
