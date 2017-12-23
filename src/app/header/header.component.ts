import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {OverlayPanel} from 'primeng/components/overlaypanel/overlaypanel';
import {AuthGuard} from '../authentication/auth-guard.service';
import {UserImageDialogComponent} from '../authentication/user-image.dialog';
import {UserService} from '../services/user.service';
import ActivityRepresentation = b.ActivityRepresentation;
import UserRepresentation = b.UserRepresentation;

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
  @ViewChild('activitiesPanel') activitiesPanel: OverlayPanel;

  constructor(private router: Router, private dialog: MatDialog, private userService: UserService, private authGuard: AuthGuard) {
  }

  ngOnInit(): void {
    this.userService.user$
      .subscribe(user => this.user = user);
    this.userService.activities$
      .subscribe(activities => {
        this.activities = activities;
        this.computeNewActivitiesCount();
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
      .subscribe(authenticated => {
        if (authenticated) {
          return this.router.navigate(['/']).then(() => {
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
