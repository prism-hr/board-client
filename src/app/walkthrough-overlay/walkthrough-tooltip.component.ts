import {Component, Inject} from '@angular/core';
import {WALKTHROUGH_COMPONENT_DIALOG_DATA} from './walkthrough-overlay.tokens';
import {WalkthroughTooltipRef} from './walkthrough-tooltip-ref';

@Component({
  template: `
    <div class="overlay-content">
      {{data.text}}
      <div *ngIf="data.orientation === 'left'"> -> </div>
      <div *ngIf="data.orientation === 'above'">(see below)</div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    h1 {
      margin: 0;
      padding: 1em;
    }

    img {
      width: 100%;
      max-width: 500px;
      height: auto;
    }

    .overlay-content {
      padding: 1em;
    }
  `]
})
export class WalkthroughTooltipComponent {

  constructor(
    public dialogRef: WalkthroughTooltipRef,
    @Inject(WALKTHROUGH_COMPONENT_DIALOG_DATA) public data: WalkthroughTooltipData) { }
}

export class WalkthroughTooltipData {
  id: string;
  text: string;
  orientation: 'left' | 'above';
}
