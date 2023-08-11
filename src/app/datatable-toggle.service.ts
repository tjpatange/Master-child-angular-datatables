import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface ToggleInterface {
  row: number;
  id: number;
  isOpen: boolean;//DataTables.Api;
}
@Injectable({
  providedIn: 'root'
})
export class DatatableToggleService {

  private toggleRowSource = new BehaviorSubject<ToggleInterface>(null);
    currentToggleRow = this.toggleRowSource.asObservable();
    toggleRowData: ToggleInterface[] = [];

    constructor() { }

    getToggleData() {
        if (localStorage.length > 0) {
            return JSON.parse(localStorage.getItem('toggle'));
        }
        return [];
    }
    addRemoveToggleData(data: any, toAdd: any) {
        if (this.toggleRowData.find(x => x.row === data.row) !== undefined) {
            this.toggleRowData.find(x => x.row === data.row).isOpen = data.isOpen;
        } else {
            if (toAdd) {
                this.toggleRowData.push(data);
            } else {
                const indexToDelete = this.toggleRowData.findIndex(x => x.row === data.row);
                this.toggleRowData.splice(indexToDelete, 1);
            }
        }
        localStorage.setItem('toggle', JSON.stringify(this.toggleRowData));
    }
    clearEnquiry() {
        localStorage.clear();
    }
}
