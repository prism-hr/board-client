import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {Element as StripeElement, StripeService} from 'ngx-stripe';
import DepartmentRepresentation = b.DepartmentRepresentation;
import {DepartmentService} from '../department.service';

@Component({
  templateUrl: 'department-subscription.component.html',
  styleUrls: ['department-subscription.component.scss']
})
export class DepartmentSubscriptionComponent implements OnInit {
  department: DepartmentRepresentation;
  card: StripeElement;
  @ViewChild('card') cardRef: ElementRef;

  constructor(private route: ActivatedRoute, private stripeService: StripeService, private departmentService: DepartmentService) {
  }

  ngOnInit() {
    this.route.parent.parent.data
      .subscribe((parentData: Data) => {
        this.department = parentData['department'];
      });

    this.stripeService.elements()
      .subscribe(elements => {
        // Only mount the element the first time
        if (!this.card) {
          this.card = elements.create('card', {
            style: {
              base: {
                iconColor: '#666EE8',
                color: '#31325F',
                lineHeight: '40px',
                fontWeight: 300,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                  color: '#CFD7E0'
                }
              }
            }
          });
          this.card.mount(this.cardRef.nativeElement);
        }
      });
  }

  submitCard() {
    this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          this.departmentService.putCustomer(this.department, result.token.id)
            .subscribe();
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }

}
