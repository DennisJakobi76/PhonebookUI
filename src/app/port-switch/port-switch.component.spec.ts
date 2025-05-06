import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortSwitchComponent } from './port-switch.component';

describe('PortSwitchComponent', () => {
  let component: PortSwitchComponent;
  let fixture: ComponentFixture<PortSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortSwitchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
