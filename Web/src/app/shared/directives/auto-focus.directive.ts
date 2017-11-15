import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
declare const $: any;

@Directive({
    selector: '[autoFocus]'
})
export class AutoFocusDirective implements AfterViewInit {

    constructor(
        private _element: ElementRef
    ) {
    }

    ngAfterViewInit(): void {
        $(this._element.nativeElement).focus();
    }    
}
