import {Component, OnInit, ViewChild} from '@angular/core';
import {MdDialog} from '@angular/material';
import {Router} from '@angular/router';
import {OverlayPanel} from 'primeng/primeng';
import {AuthGuard} from '../authentication/auth-guard.service';
import {UserImageDialogComponent} from '../authentication/user-image.dialog';
import {ResourceService} from '../services/resource.service';
import {UserService} from '../services/user.service';
import ActivityRepresentation = b.ActivityRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  selector: 'b-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: UserRepresentation;
  activities: ActivityRepresentation[];
  @ViewChild('activitiesPanel') activitiesPanel: OverlayPanel;

  constructor(private router: Router, private dialog: MdDialog, private userService: UserService, private resourceService: ResourceService,
              private authGuard: AuthGuard) {
  }

  ngOnInit(): void {
    this.userService.user$
      .subscribe(user => this.user = user);
    this.userService.activities$
      .subscribe(activities => this.activities = activities);
  }

  activityDismissed(activity: ActivityRepresentation) {
    const idx = this.activities.indexOf(activity);
    this.activities.splice(idx, 1);
    this.activitiesPanel.hide();
  }

  showLogin() {
    this.authGuard.ensureAuthenticated({modalType: 'login'}).first() // open dialog if not authenticated
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
    this.userService.logout().subscribe();
    return this.router.navigate(['']);
  }

}
