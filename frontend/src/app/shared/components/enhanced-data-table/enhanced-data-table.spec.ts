import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnhancedDataTable } from './enhanced-data-table';

describe('EnhancedDataTable', () => {
  let component: EnhancedDataTable;
  let fixture: ComponentFixture<EnhancedDataTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnhancedDataTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnhancedDataTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
