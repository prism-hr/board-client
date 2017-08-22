import {DebugElement} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MdSnackBarModule} from '@angular/material';
import {By} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {CloudinaryModule} from '@cloudinary/angular-4.x';
import * as Cloudinary from 'cloudinary-core';
import {ButtonModule, ChipsModule, FileUploadModule} from 'primeng/primeng';
import {ResourceHandleComponent} from '../../controls/resource-handle.component';
import {FileUploadComponent} from '../../general/file-upload.component';
import {DefinitionsService} from '../../services/definitions.service';
import {ResourceService} from '../../services/resource.service';
import {FakeDefinitionsService} from '../../testing/fake-definitions.service';
import {FakeResourceService} from '../../testing/fake-resource.service';
import {click, newEvent} from '../../testing/index';
import {ActivatedRouteStub, RouterStub} from '../../testing/router-stubs';
import {ControlMessagesComponent} from '../../validation/control-messages.component';
import {DepartmentEditComponent} from './department-edit.component';
import '../../rxjs-extensions';

describe('DepartmentView', () => {

  let fixture: ComponentFixture<DepartmentEditComponent>;

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
        DepartmentEditComponent, ControlMessagesComponent, ResourceHandleComponent, FileUploadComponent
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
    fixture = TestBed.createComponent(DepartmentEditComponent);
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
