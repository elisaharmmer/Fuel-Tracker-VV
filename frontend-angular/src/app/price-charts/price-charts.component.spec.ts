import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceChartsComponent } from './price-charts.component';

describe('PriceChartsComponent', () => {
  let component: PriceChartsComponent;
  let fixture: ComponentFixture<PriceChartsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PriceChartsComponent]
    });
    fixture = TestBed.createComponent(PriceChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
