import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, NgControl, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { FilterAutocompleteTextbox } from '../_models/filter-autocomplete-textbox';

@Component({
  selector: 'lib-autocomplete-textbox',
  templateUrl: './autocomplete-textbox.component.html',
  styleUrls: ['./autocomplete-textbox.component.css']
})
export class AutocompleteTextboxComponent implements OnInit {
  @Input() control: FilterAutocompleteTextbox;
  @Input() form: FormGroup;
  @Input() options: Observable<any[]>;

  @Output() valueUpdate = new EventEmitter<string>();

  innerControl = new FormControl();

  get frmControl(): AbstractControl {
    return this.form.controls[this.control.key];
  }
  get isValid() { return (this.form.controls[this.control.key].valid); }
  
  constructor() { }

  ngOnInit(): void {
    this.innerControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      // tap(_ => (this.loading = true)),
      switchMap(term => {
        return new Observable((observer) => {
          try {
            this.valueUpdate.emit(term);
            observer.next();
            observer.complete();
          } catch (error) {
            observer.error(error);
          } finally {
          }
        });
      }),
      // tap(_ => (this.loading = false))
    ).subscribe();
  }

  SelectValue(value: (string | {})): void {
    console.log(this.form.controls);
    if (value && typeof(value) === 'string') {
      this.frmControl.setValue(value);
    } else if (value && typeof(value) === 'object' && this.control.remoteKey) {
      this.frmControl.setValue(value[this.control.remoteKey]);
    }
  }
}
