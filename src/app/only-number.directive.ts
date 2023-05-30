import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[onlyNumber]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OnlyNumberDirective),
      multi: true,
    },
  ],
})
export class OnlyNumberDirective implements ControlValueAccessor, OnInit {
  private onChange: (val: string | number) => void;
  private onTouched: () => void;
  private value: string;
  private regex: RegExp;

  @Input() decimals = 0;
  @Input() allowNegative = false;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    /** // For reference
      const regexMapping = {
          integer: /^[0-9]*$/,
          integerWithNegative: /^\-?[0-9]*$/,
          decimal: /^\d*\.?\d{0,2}$/,
          decimalWithNegative: /^\-?\d*\.?\d{0,2}$/,
      } */

    let regStr = '^[0-9]*$';
    if (this.decimals > 0) {
      regStr = `^\\d*\\.?\\d{0,${this.decimals}}$`;
    }
    if (this.allowNegative) {
      regStr = `^\-?${regStr.slice(1)}`;
    }
    this.regex = new RegExp(regStr);
  }

  @HostListener('input', ['$event.target.value'])
  onInputChange(value: string) {
    this.updateTextInput(value, this.isValid(value));
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  private updateTextInput(value: string, propagateChange: boolean) {
    if (propagateChange) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
      this.onChange(+value);
      this.value = value;
    } else {
      this.renderer.setProperty(
        this.elementRef.nativeElement,
        'value',
        this.value
      );
    }
  }

  // ControlValueAccessor Interface
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    console.log('isDisabled', isDisabled);
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'disabled',
      isDisabled
    );
  }

  writeValue(value: any): void {
    value = value ? String(value) : '';
    this.value = value;
    this.updateTextInput(value, false);
  }

  private isValid(value): boolean {
    return this.regex.test(value);
  }
}
