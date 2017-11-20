import { ErrorHandler, Injectable, ApplicationRef, Injector } from '@angular/core';
import { LoggerService } from './logger.service';
import { ToastService } from './toast.service';
import { environment } from '../../environments/environment';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private logger: LoggerService, private toast: ToastService, private inj: Injector) { }

  handleError(errorResponse: any): void {
    if (errorResponse.status === 401) {
      this.toast.showError('Unauthorised. Pleae login again.');
      this.inj.get(ApplicationRef).tick();
      // todo: navigateToSignIn
    } else if (errorResponse.status === 400) {
      console.log('***** HANDLE ERROR *****');
      this.toast.showError(errorResponse.error.message + '/n' + this.toast.formatErrors(errorResponse.error.errors));
      this.inj.get(ApplicationRef).tick();
    }

    if (!environment.production) {
      this.toast.showError(errorResponse);
    }

    this.logger.error(errorResponse);
    // IMPORTANT: Don't Rethrow the error otherwise it will not emit errors after once
    // https://stackoverflow.com/questions/44356040/angular-global-error-handler-working-only-once
    // throw errorResponse;
  }

}
