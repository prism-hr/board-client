import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {OverlayPanel} from 'primeng/components/overlaypanel/overlaypanel';
import {AuthGuard} from '../authentication/auth-guard.service';
import {UserImageDialogComponent} from '../authentication/user-image.dialog';
import {ResourceService} from '../services/resource.service';
import {UserService} from '../services/user.service';
import ActivityRepresentation = b.ActivityRepresentation;
import UserRepresentation = b.UserRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  selector: 'b-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  mobileMenu: false;
  user: UserRepresentation;
  activities: ActivityRepresentation[];
  newActivitiesCount: number;
  departments: DepartmentRepresentation[];
  departmentLink: any[];
  departmentsMenuItems: MenuItem[];
  mobileDepartmentsMenuItems: MenuItem[];
  resourceScope: string;
  @ViewChild('activitiesPanel') activitiesPanel: OverlayPanel;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private dialog: MatDialog, private userService: UserService,
              private authGuard: AuthGuard, private resourceService: ResourceService) {
  }

  ngOnInit(): void {
    this.userService.user$
      .subscribe(user => this.user = user);
    this.userService.activities$
      .subscribe(activities => {
        this.activities = activities;
        this.computeNewActivitiesCount();
      });
    this.userService.departments$
      .subscribe(departments => {
        this.departments = departments;
        this.departmentsMenuItems = departments
          .map(department => ({label: department.name, routerLink: this.resourceService.routerLink(department)}));
        this.mobileDepartmentsMenuItems = [{label: 'Departments', items: this.departmentsMenuItems}];
        if (departments.length === 1) {
          this.departmentLink = this.resourceService.routerLink(departments[0]);
        }
      });

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => {
        let child = this.activatedRoute.firstChild;
        let resourceScope = null;
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
            if (child.snapshot.data && child.snapshot.data['resourceScope']) {
              resourceScope = child.snapshot.data['resourceScope'];
            }
          } else {
            return resourceScope;
          }
        }
        return null;
      }).subscribe((resourceScope: string) => {
      this.resourceScope = resourceScope;
    });
  }

  activityDismissed(activity: ActivityRepresentation) {
    const idx = this.activities.indexOf(activity);
    this.activities.splice(idx, 1);
    this.computeNewActivitiesCount();
  }

  activityViewed(activity: ActivityRepresentation) {
    this.activitiesPanel.hide();
    this.computeNewActivitiesCount();
  }

  showLogin() {
    this.authGuard.ensureAuthenticated({initialView: 'LOGIN'}).first() // open dialog if not authenticated
      .subscribe(authenticationOutcome => {
        if (authenticationOutcome) {
          let link = ['/'];
          if(authenticationOutcome.departments && authenticationOutcome.departments.length >= 1) {
            link = this.resourceService.routerLink(authenticationOutcome.departments[0]);
          }
          return this.router.navigate(link).then(() => {
            this.userService.user$.first().subscribe(user => {
              if (!user.documentImage && user.documentImageRequestState !== 'DISPLAY_NEVER') {
                this.dialog.open(UserImageDialogComponent, {disableClose: true});
              }
            });
          });
        }
      });
  }

  logout() {
    this.userService.logout();
    return this.router.navigate(['']);
  }

  private computeNewActivitiesCount() {
    this.newActivitiesCount = this.activities.filter(a => !a.viewed).length;
  }

}
