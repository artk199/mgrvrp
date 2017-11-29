import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotInfoComponent } from './depot-info.component';

describe('DepotInfoComponent', () => {
  let component: DepotInfoComponent;
  let fixture: ComponentFixture<DepotInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepotInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepotInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
