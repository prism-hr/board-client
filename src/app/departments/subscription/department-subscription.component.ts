import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {ElementOptions, StripeCardComponent, StripeService} from 'ngx-stripe';
import {switchMap} from 'rxjs/internal/operators';
import {DepartmentService} from '../department.service';
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  templateUrl: 'department-subscription.component.html',
  styleUrls: ['department-subscription.component.scss']
})
export class DepartmentSubscriptionComponent implements OnInit {
  department: DepartmentRepresentation;
  customer: any;
  subscription: any;
  elementOptions: ElementOptions;
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  constructor(private route: ActivatedRoute, private stripeService: StripeService, private departmentService: DepartmentService) {
  }

  ngOnInit() {
    this.route.data
      .subscribe((parentData: Data) => {
        this.department = parentData['department'];
        this.departmentService.getPaymentSources(this.department)
          .subscribe(customer => this.applyCustomer(customer));
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
      .createSource(this.card.getCard())
      // .pipe(
      //   switchMap(result => {
      //     return this.stripeService
      //       .createSource(<any>{
      //         type: 'three_d_secure',
      //         amount: 2999,
      //         currency: 'gbp',
      //         three_d_secure: {
      //           card: result.source.id
      //         },
      //         redirect: {
      //           return_url: 'https://pudelek.pl'
      //         }
      //       });
      //   })
      // )
      .subscribe(result => {
        // this.card.getCard().clear();
        if (result.source) {
          this.departmentService.postPaymentSource(this.department, result.source.id)
            .subscribe(customer => this.applyCustomer(customer));
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }

  deleteSource(source: any) {
    this.departmentService.deletePaymentSource(this.department, source.id)
      .subscribe(customer => this.applyCustomer(customer));
  }

  setSourceAsDefault(source: any) {
    this.departmentService.setPaymentSourceAsDefault(this.department, source.id)
      .subscribe(customer => this.applyCustomer(customer));
  }

  cancelSubscription() {
    this.departmentService.cancelSubscription(this.department)
      .subscribe(customer => this.applyCustomer(customer));
  }

  restoreSubscription() {
    this.departmentService.restoreSubscription(this.department)
      .subscribe(customer => this.applyCustomer(customer));
  }

  createSubscription() {
    this.departmentService.createSubscription(this.department)
      .subscribe(customer => this.applyCustomer(customer));
  }

  private applyCustomer(customer: any) {
    this.customer = customer;
    this.subscription = customer && customer.subscriptions.data[0];
  }
}
