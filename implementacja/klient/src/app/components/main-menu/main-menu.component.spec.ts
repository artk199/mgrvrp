import {MainMenuComponent} from './main-menu.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatTabGroup, MatTabsModule} from '@angular/material';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

describe('MainMenuComponent', () => {

  let comp: MainMenuComponent;
  let fixture: ComponentFixture<MainMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainMenuComponent],
      imports: [
        MatTabsModule
      ]
    })
      .compileComponents();
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuComponent);
    comp = fixture.componentInstance;
  });

  it('Sould component be created', () => {
    expect(comp).toBeTruthy();
  });

  it('Should have top menu', () => {
    const tabGroup: DebugElement = fixture.debugElement.query(By.directive(MatTabGroup));
    expect(tabGroup).toBeTruthy();
  });

  it('Should have top menu with 100% witdth', () => {
    const tabGroup: DebugElement = fixture.debugElement.query(By.directive(MatTabGroup));
    expect(tabGroup).toBeTruthy();
  });


});
