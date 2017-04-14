import {DebugElement} from '@angular/core';

export function newEvent(eventName: string, bubbles = false, cancelable = false) {
  const evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
  evt.initCustomEvent(eventName, bubbles, cancelable, null);
  return evt;
}

export function click(el: DebugElement | HTMLElement): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', {button: 0});
  }
}
