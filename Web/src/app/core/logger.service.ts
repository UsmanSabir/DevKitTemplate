import { Injectable } from '@angular/core';


@Injectable()
export class LoggerService {

    debug(msg: any, ...optionalParams: any[]) {
        console.log(msg, optionalParams);
    }

    log(msg: any, ...optionalParams: any[]) {
        console.log(msg, optionalParams);
    }

    error(msg: any, ...optionalParams: any[]) {
        console.error(msg, optionalParams);
    }

}
