import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appEnterSubmit]',
  standalone: true
})
export class EnterSubmitDirective {
  @Output() enterSubmit = new EventEmitter<void>();

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enterSubmit.emit();
    }
  }
}
