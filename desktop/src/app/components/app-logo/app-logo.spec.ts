import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLogoComponent as AppLogo } from './app-logo';

describe('AppLogo', () => {
  let component: AppLogo;
  let fixture: ComponentFixture<AppLogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppLogo],
    }).compileComponents();

    fixture = TestBed.createComponent(AppLogo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
