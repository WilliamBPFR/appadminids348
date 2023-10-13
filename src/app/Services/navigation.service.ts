import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class NavigationService {
  private navigationEvent = new Subject<void>();

  getNavigationEvent() {
    return this.navigationEvent.asObservable();
  }

  triggerNavigationEvent() {
    this.navigationEvent.next();
  }
}
