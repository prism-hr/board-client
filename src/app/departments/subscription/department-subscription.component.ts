import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {ElementOptions, StripeCardComponent, StripeService} from 'ngx-stripe';
import * as Stripe from 'stripe';
import {ICard} from 'stripe';
import {DepartmentService} from '../department.service';
import DepartmentRepresentation = b.DepartmentRepresentation;
import ICustomer = Stripe.customers.ICustomer;

@Component({
  templateUrl: 'department-subscription.component.html',
  styleUrls: ['department-subscription.component.scss']
})
export class DepartmentSubscriptionComponent implements OnInit {
  department: DepartmentRepresentation;
  customer: ICustomer;
  elementOptions: ElementOptions;
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  constructor(private route: ActivatedRoute, private stripeService: StripeService, private departmentService: DepartmentService) {
  }

  ngOnInit() {
    this.route.parent.parent.data
      .subscribe((parentData: Data) => {
        this.department = parentData['department'];
        this.departmentService.getPaymentSources(this.department)
          .subscribe(customer => {
            this.customer = customer;
          });
      });

    this.elementOptions = {
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
    };
  }

  submitCard() {
    this.stripeService
      .createToken(this.card.getCard(), {name})
      .subscribe(result => {
        this.card.getCard().clear();
        if (result.token) {
          this.departmentService.postPaymentSource(this.department, result.token.id)
            .subscribe(customer => {
              this.customer = customer;
            });
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }

  deleteSource(source: ICard) {
    this.departmentService.deletePaymentSource(this.department, source.id)
      .subscribe(customer => {
        this.customer = customer;
      });
  }

  setSourceAsDefault(source: ICard) {
    this.departmentService.setPaymentSourceAsDefault(this.department, source.id)
      .subscribe(customer => {
        this.customer = customer;
      });
  }

}
