import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionFormDialog } from './provision-form-dialog';

describe('ProvisionFormDialog', () => {
  let component: ProvisionFormDialog;
  let fixture: ComponentFixture<ProvisionFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvisionFormDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvisionFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
