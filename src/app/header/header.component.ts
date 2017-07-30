import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthGuard} from '../authentication/auth-guard.service';
import {ResourceService} from '../services/resource.service';
import {UserService} from '../services/user.service';
import ActivityRepresentation = b.ActivityRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  selector: 'b-header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: UserRepresentation;
  activities: ActivityRepresentation[];

  constructor(private router: Router, private userService: UserService, private resourceService: ResourceService,
              private authGuard: AuthGuard) {
  }

  ngOnInit(): void {
    this.userService.user$
      .subscribe(user => this.user = user);
    this.userService.activities$
      .subscribe(activities => this.activities = activities);
  }

  showLogin() {
    this.authGuard.ensureAuthenticated().first() // open dialog if not authenticated
      .subscribe(authenticated => {
        if (authenticated) {
          return this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.userService.logout().subscribe();
    return this.router.navigate(['']);
  }

  activityClicked(activity: ActivityRepresentation) {
    this.userService.dismissActivity(activity).subscribe();
  }

  routerLink(resource: ResourceRepresentation<any>) {
    return this.resourceService.routerLink(resource);
  }
}
