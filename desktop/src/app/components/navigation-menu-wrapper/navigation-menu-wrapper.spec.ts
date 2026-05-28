import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMenuWrapperComponent as NavigationMenuWrapper } from './navigation-menu-wrapper';

describe('NavigationMenuWrapper', () => {
  let component: NavigationMenuWrapper;
  let fixture: ComponentFixture<NavigationMenuWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationMenuWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationMenuWrapper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
