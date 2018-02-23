import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {OriginConnectionPosition, OverlayConnectionPosition} from '@angular/cdk/overlay/typings/position/connected-position';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {ScrollDispatcher} from '@angular/cdk/scrolling';
import {ComponentRef, ElementRef, Injectable, Injector, NgZone} from '@angular/core';
import {AsyncSubject} from 'rxjs/AsyncSubject';
import {WALKTHROUGH_COMPONENT_DIALOG_DATA} from './walkthrough-overlay.tokens';
import {WalkthroughTooltipRef} from './walkthrough-tooltip-ref';
import {WalkthroughTooltipComponent, WalkthroughTooltipData} from './walkthrough-tooltip.component';

const DEFAULT_CONFIG: OverlayConfig = {};

@Injectable()
export class WalkthroughOverlayService {

  constructor(private injector: Injector, private ngZone: NgZone, private _scrollDispatcher: ScrollDispatcher, private overlay: Overlay) {
  }

  open() {
    const tooltips: WalkthroughTooltipData[] = [
      {id: 'walkthrough_badge', text: 'Advertise the department on your website', orientation: 'above'}];

    const tooltipRefs: WalkthroughTooltipRef[] = [];
    const elements: HTMLElement[] = [];
    let overlayRefWithBackdrop = null;
    tooltips.forEach((tooltip, index) => {
      const element = document.getElementById(tooltip.id);
      elements.push(element);

      const elementRef = new ElementRef(element);

      const config = {...DEFAULT_CONFIG};
      if (index === 0) {
        config.hasBackdrop = true;
      }

      const overlayRef = this.createOverlay(config, tooltip, elementRef);

      const tooltipRef = new WalkthroughTooltipRef(overlayRef);
      tooltipRefs.push(tooltipRef);

      this.attachDialogContainer(overlayRef, tooltipRef, tooltip);

      if (index === 0) {
        overlayRefWithBackdrop = overlayRef;
      }
    });

    const overlayClosed = new AsyncSubject();

    const closeOverlay = () => {
      tooltipRefs.forEach(ref => ref.close());
      overlayClosed.next({});
      overlayClosed.complete();
    };
    overlayRefWithBackdrop.backdropClick()
      .subscribe(closeOverlay);

    elements.forEach(element => {
      let elementToHighlight = element;
      if (elementToHighlight.parentElement.tagName.toLowerCase() === 'li') {
        elementToHighlight = elementToHighlight.parentElement;
      }
      elementToHighlight.classList.add('walkthrough-highlight');

      element.onclick = () => {
        elementToHighlight.classList.remove('walkthrough-highlight');
        closeOverlay();
      };
    });


    return overlayClosed.asObservable();
  }

  private createOverlay(config: OverlayConfig, tooltip: WalkthroughTooltipData, elementRef: ElementRef) {
    const overlayConfig = this.getOverlayConfig(config, tooltip, elementRef);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(overlayRef: OverlayRef, dialogRef: WalkthroughTooltipRef, data: WalkthroughTooltipData) {
    const injector = this.createInjector(dialogRef, data);

    const containerPortal = new ComponentPortal(WalkthroughTooltipComponent, null, injector);
    const containerRef: ComponentRef<WalkthroughTooltipComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(dialogRef: WalkthroughTooltipRef, data: WalkthroughTooltipData): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(WalkthroughTooltipRef, dialogRef);
    injectionTokens.set(WALKTHROUGH_COMPONENT_DIALOG_DATA, data);

    return new PortalInjector(this.injector, injectionTokens);
  }

  private getOverlayConfig(config: OverlayConfig, tooltip: WalkthroughTooltipData, elementRef: ElementRef): OverlayConfig {
    let positionDef: { originPos: OriginConnectionPosition, overlayPos: OverlayConnectionPosition };
    if (tooltip.orientation === 'left') {
      positionDef = {originPos: {originX: 'start', originY: 'center'}, overlayPos: {overlayX: 'end', overlayY: 'center'}};
    } else if (tooltip.orientation === 'above') {
      positionDef = {originPos: {originX: 'center', originY: 'top'}, overlayPos: {overlayX: 'center', overlayY: 'bottom'}};
    }

    const positionStrategy = this.overlay.position()
      .connectedTo(elementRef, positionDef.originPos, positionDef.overlayPos);

    return new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });
  }

}

