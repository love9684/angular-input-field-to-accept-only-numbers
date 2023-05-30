import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // Template Driven Form
  decimal = 123.45;
  decimalWithNegative = -987.01;
  integer = 123;
  integerWithNegative = -456;

  // Reactive Form
  formGroup = new FormGroup({
    integer: new FormControl(1234),
    integerWithNegative: new FormControl(-1234),
    decimal: new FormControl(1234.6),
    decimalWithNegative: new FormControl(-1234.2),
  });

  ngOnInit() {
    this.formGroup.valueChanges.subscribe((value) =>
      console.log('formValue changed', value)
    );
  }

  onClick() {
    console.log('this', this);
    // this.formGroup.get('number').enable();
  }
}
