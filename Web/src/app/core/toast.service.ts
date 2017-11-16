import { Injectable } from '@angular/core';
import { SnotifyService } from 'ng-snotify';

@Injectable()
export class ToastService {

  constructor(private snotifyService: SnotifyService) { }

  showError(err){
    this.snotifyService.error(err, 'error');

    //this.snotifyService.simple("this.body", "this.title");
  }

  showSuccess(msg){
    this.snotifyService.success(msg, 'success');
  }

  showInfo(msg){
    this.snotifyService.info(msg, 'info');
  }

  showWarning(msg){
    this.snotifyService.warning(msg, 'warning');
  }

}
