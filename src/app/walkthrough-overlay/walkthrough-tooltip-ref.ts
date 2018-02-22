import {OverlayRef} from '@angular/cdk/overlay';

export class WalkthroughTooltipRef {

  constructor(private overlayRef: OverlayRef) {
  }

  close(): void {
    this.overlayRef.dispose();
  }
}
