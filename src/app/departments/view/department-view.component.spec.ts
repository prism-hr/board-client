import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {DepartmentViewComponent} from './department-view.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ControlMessagesComponent} from '../../validation/control-messages.component';
import {ButtonModule, ChipsModule} from 'primeng/primeng';
import {BoardAliasesComponent} from '../../boards/board-aliases.component';
import {FileUploadComponent} from '../../general/file-upload.component';
import {CloudinaryModule} from '@cloudinary/angular';
import {FileUploadModule} from 'ng2-file-upload';
import {ActivatedRoute, Router} from '@angular/router';
import {ResourceService} from '../../services/resource.service';
import {MdSnackBarModule} from '@angular/material';
import {DefinitionsService} from '../../services/definitions.service';
import * as Cloudinary from 'cloudinary-core';
import {RouterTestingModule} from '@angular/router/testing';
import {FakeDefinitionsService} from '../../testing/fake-definitions.service';
import {click, newEvent} from '../../testing/index';
import {By} from '@angular/platform-browser';
import {ActivatedRouteStub, RouterStub} from '../../testing/router-stubs';
import {FakeResourceService} from '../../testing/fake-resource.service';
import {DebugElement} from '@angular/core';

describe('DepartmentView', () => {

  let fixture: ComponentFixture<DepartmentViewComponent>;

  class Page {
    submitSpy: jasmine.Spy;

    nameInput: HTMLInputElement;
    submitBtn: DebugElement;

    constructor() {
      const compInjector = fixture.debugElement.injector;
      const resourceService = compInjector.get(ResourceService);

      this.submitSpy = spyOn(resourceService, 'patchDepartment').and.callThrough();
    }

    addPageElements() {
      this.nameInput = fixture.debugElement.query(By.css('[formControlName="name"]')).nativeElement;
      this.submitBtn = fixture.debugElement.query(By.css('button')).nativeElement;
    }

  }

  let page;
  const activatedRoute = new ActivatedRouteStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DepartmentViewComponent, ControlMessagesComponent, BoardAliasesComponent, FileUploadComponent
      ],
      imports: [ReactiveFormsModule, RouterTestingModule, MdSnackBarModule, ButtonModule, ChipsModule,
        CloudinaryModule.forRoot(Cloudinary, {cloud_name: 'bitfoot'}), FileUploadModule],
      providers: [{
        provide: ActivatedRoute,
        useValue: activatedRoute
      }, {
        provide: Router,
        useClass: RouterStub
      }, {
        provide: ResourceService,
        useClass: FakeResourceService
      }, {
        provide: DefinitionsService,
        useClass: FakeDefinitionsService
      }]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    activatedRoute.testData = {department: {id: 8, name: 'Dep1', handle: 'dep1', memberCategories: ['cat1', 'cat2']}};
    fixture = TestBed.createComponent(DepartmentViewComponent);
    page = new Page();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.addPageElements();
    });
  }));

  it('should change form and submit', async(() => {
    page.nameInput.value = 'Dep2';
    page.nameInput.dispatchEvent(newEvent('input'));

    click(page.submitBtn);
    fixture.detectChanges();
    console.log('Dupa3 ' + JSON.stringify(page.submitSpy.calls.any()));
    expect(page.submitSpy.calls.any()).toBe(true);
    expect(page.submitSpy.calls.mostRecent().args).toEqual([8, {
      name: 'Dep2',
      memberCategories: ['cat1', 'cat2'],
      documentLogo: null,
      handle: 'dep1'
    }]);
  }));

});
