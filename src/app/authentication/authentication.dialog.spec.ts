/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {AuthenticationDialog} from "./authentication.component";
import {StormpathModule} from "angular-stormpath";

describe('AuthenticationDialog', () => {
  let component: AuthenticationDialog;
  let fixture: ComponentFixture<AuthenticationDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthenticationDialog],
      imports: [StormpathModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the stormpath authport', async(() => {
    const fixture = TestBed.createComponent(AuthenticationDialog);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('sp-authport')).toBeDefined();
  }));
});
