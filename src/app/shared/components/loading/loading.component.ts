import { Component, Input, HostBinding } from '@angular/core';

@Component({
    selector: 'loading',
    templateUrl: './loading.component.html',
})
export class LoadingComponent {
    @HostBinding('class.show-loading') 
    @Input() show: boolean = true;
}