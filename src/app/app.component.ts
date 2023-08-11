
import { Component, ComponentFactoryResolver, ComponentRef, ViewChild, ElementRef, OnInit, ViewContainerRef, Renderer2, OnDestroy } from '@angular/core';
import { TestService } from './test.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { EmployeeDetailComponent } from './component/employee-detail/employee-detail.component';
import { DatatableToggleService, ToggleInterface } from './datatable-toggle.service';
import { Employee } from './employee.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'DatatableTest';
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  employeeData: Employee[] = [];
  toggleData: ToggleInterface[] = [];
  private childRow: ComponentRef<EmployeeDetailComponent> | undefined;
  constructor(private testService: TestService,
    private toggleService: DatatableToggleService,
    private compFactory: ComponentFactoryResolver,
    private viewRef: ViewContainerRef,
    private elRef: ElementRef,
    private _renderer: Renderer2) { }

  ngOnInit() {
    this.dtOptions = {
      paging: false,
      processing: false,
      searching: false
    };
    this.testService.getEmployee()
      .subscribe(data => {
        this.employeeData = data;
        this.dtTrigger.next();
        //this.openDefault();
      }, error => {
    
      }, () => {
        this.setToggleData();
      });
  }

  openDefault() {
    const ids = this.employeeData.map(x => x.id);
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      let i = 0;
      let _row = 0;
      const trRef = this.elRef.nativeElement.querySelector('tr');
      ids.forEach(el => {
        const row = dtInstance.row(i);
        const factory = this.compFactory.resolveComponentFactory(EmployeeDetailComponent);
        this.childRow = this.viewRef.createComponent(factory);
        const data = this.employeeData.find(x => x.id === el);
        this.childRow.instance.employee = data;
        this._renderer.addClass(trRef, 'shown');
      });
    });
  }

  setToggleData() {
    let count = 0;
    this.toggleData = this.toggleService.getToggleData();
    this.employeeData.forEach(el => {
      this.toggleData.push({ row: count, id: el.id, isOpen: false });
      const d = this.toggleData.find(x => x.id === el.id);
      const toShow = d === undefined ? false : d.isOpen;
      const toAdd = this.toggleData.find(x => x.id === el.id) === undefined ? false : true;
      this.toggleService.addRemoveToggleData({ row: count, id: el.id, isOpen: toShow }, toAdd);
      count++;
    });
  }

  toggleRow(i: number, e: number) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      const trRef = this.elRef.nativeElement.querySelector('tr');
      const row = dtInstance.row(i);
      if (row.child.isShown()) {
        row.child.hide();
        this._renderer.removeClass(trRef, 'shown');
      } else {
        const factory = this.compFactory.resolveComponentFactory(EmployeeDetailComponent);
        this.childRow = this.viewRef.createComponent(factory);
        const data = this.employeeData.find(x => x.id === e);
        this.childRow.instance.rowId = i;
        this.childRow.instance.employee = data;
        row.child(this.childRow.location.nativeElement).show();
        this._renderer.addClass(trRef, 'shown');
      }
      const d = this.toggleData.find(x => x.row === i);
      d.isOpen = Boolean(row.child.isShown());
      this.toggleService.addRemoveToggleData(d, true);
    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}
