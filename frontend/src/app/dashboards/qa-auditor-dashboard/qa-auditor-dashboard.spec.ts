import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QaAuditorDashboard } from './qa-auditor-dashboard';

describe('QaAuditorDashboard', () => {
  let component: QaAuditorDashboard;
  let fixture: ComponentFixture<QaAuditorDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QaAuditorDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QaAuditorDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
