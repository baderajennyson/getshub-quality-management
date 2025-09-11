import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionsManagement } from './provisions-management';

describe('ProvisionsManagement', () => {
  let component: ProvisionsManagement;
  let fixture: ComponentFixture<ProvisionsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvisionsManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvisionsManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
