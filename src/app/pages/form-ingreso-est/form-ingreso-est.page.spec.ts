import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormIngresoEstPage } from './form-ingreso-est.page';

describe('FormIngresoEstPage', () => {
  let component: FormIngresoEstPage;
  let fixture: ComponentFixture<FormIngresoEstPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FormIngresoEstPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
