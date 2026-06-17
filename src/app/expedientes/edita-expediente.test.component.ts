import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditaExpedienteComponent } from './edita-expediente.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('EditaExpedienteComponent', () => {
  let component: EditaExpedienteComponent;
  let fixture: ComponentFixture<EditaExpedienteComponent>;
  let modalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    modalService = jasmine.createSpyObj('NgbModal', ['dismissAll']);

    await TestBed.configureTestingModule({
      declarations: [ EditaExpedienteComponent ],
      providers: [
        { provide: NgbModal, useValue: modalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditaExpedienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

it('should set showGenerarEntrada to true when clickGenerarEntrada is called', () => {

  component.showGenerarEntrada = false;

  component.clickGenerarEntrada();

  expect(component.showGenerarEntrada).toBe(true);
});
});
