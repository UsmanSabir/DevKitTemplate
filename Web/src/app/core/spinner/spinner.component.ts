import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LoggerService } from '../logger.service';
import { SpinnerService, SpinnerState } from './spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnDestroy, OnInit {
  visible = false;
 
  private spinnerStateChanged: Subscription;
 
  constructor(
    private loggerService: LoggerService,
    private spinnerService: SpinnerService
  ) { }
 
  ngOnInit() {
    console.log(this.visible);
    this.spinnerStateChanged = this.spinnerService.spinnerState
      .subscribe((state: SpinnerState) => {
        this.visible = state.show;
        this.loggerService.log(`visible=${this.visible}`);
      });
  }
 
  ngOnDestroy() {
    this.spinnerStateChanged.unsubscribe();
  }
}
