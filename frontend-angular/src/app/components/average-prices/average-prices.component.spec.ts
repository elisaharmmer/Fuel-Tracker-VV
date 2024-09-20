import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AveragePricesComponent } from './average-prices.component';

describe('AveragePricesComponent', () => {
  let component: AveragePricesComponent;
  let fixture: ComponentFixture<AveragePricesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AveragePricesComponent]
    });
    fixture = TestBed.createComponent(AveragePricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
