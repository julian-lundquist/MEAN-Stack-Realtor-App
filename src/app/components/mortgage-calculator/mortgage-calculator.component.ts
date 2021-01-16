import { Component, OnInit } from '@angular/core';
import {createNumberMask} from 'text-mask-addons';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-mortgage-calculator',
  templateUrl: './mortgage-calculator.component.html',
  styleUrls: ['./mortgage-calculator.component.css']
})
export class MortgageCalculatorComponent implements OnInit {

  public dollarMask = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: false,
    thousandsSeparatorSymbol: ',',
    allowDecimal: false,
    decimalSymbol: '.',
    decimalLimit: 1,
    integerLimit: 10,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true
  });

  public percentMask = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: false,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 1,
    integerLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: false
  });

  public integerMask = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: false,
    thousandsSeparatorSymbol: '',
    allowDecimal: false,
    decimalSymbol: '.',
    decimalLimit: 1,
    integerLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: false
  });

  mortgageForm: FormGroup;
  loanAmount: number;
  interestPercent: number;
  repaymentInYears: number;
  monthlyPayment: number;
  totalPayment: number;
  mortgageCalcSubmitted: boolean = false;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.mortgageForm = this.formBuilder.group({
      loanAmount: new FormControl('', [Validators.required]),
      interestPercent: new FormControl('', [Validators.required]),
      repaymentInYears: new FormControl('', [Validators.required])
    });
  }

  get mortgageF() { return this.mortgageForm.controls; }

  public monthlyPaymentCalc(mortgageCalcForm: FormGroup) {
    this.mortgageCalcSubmitted = true;

    if (this.mortgageForm.invalid) {
      return;
    }

    let loanAmount: number = mortgageCalcForm.get('loanAmount').value;
    let interestPercent: number = mortgageCalcForm.get('interestPercent').value;
    let repaymentInYears: number = mortgageCalcForm.get('repaymentInYears').value;
    this.loanAmount = loanAmount;
    this.interestPercent = interestPercent;
    this.repaymentInYears = repaymentInYears;

    let yearsInMonths: number = repaymentInYears * 12

    this.monthlyPayment = Number(((loanAmount * ((interestPercent / 100) / 12) * Math.pow((1 + (interestPercent / 100) / 12), yearsInMonths)) / (Math.pow((1 + (interestPercent / 100) / 12), yearsInMonths) - 1)).toFixed(2));
    this.totalPayment = this.monthlyPayment * yearsInMonths;

    this.mortgageForm.reset();
    this.mortgageCalcSubmitted = false;
  }
}
