import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit changeFilter event with the provided filter', () => {
    const filter = 'testFilter';
    const emitSpy = spyOn(component.changeFilter, 'emit');

    component.change(filter);

    expect(emitSpy).toHaveBeenCalledWith(filter);
  });

  it('should have selectedFilter input', () => {
    component.selectedFilter = 'rising';
    fixture.detectChanges();
    expect(component.selectedFilter).toBe('rising');
  });
});