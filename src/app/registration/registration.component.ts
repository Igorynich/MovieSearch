import {Component, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators
} from "@angular/forms";

import {ErrorStateMatcher} from "@angular/material";
import {HttpService} from "../services/http.service";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registrationForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password1: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password2: new FormControl('', [Validators.required, Validators.minLength(5)])
  }, [this.passwordsMatchValidation]);

  matcher = new MyErrorStateMatcher();
  showResult: boolean = false;
  result: string;
  badResult = 'Такой пользователь уже зарегистрирован';
  goodResult = 'Регистрация прошла успешно';

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
    this.showResult = false;
  }

  register() {
    let credentials = {
      username: this.registrationForm.controls.username.value,
      password: this.registrationForm.controls.password1.value
    };
    this.httpService.registerNewUser(credentials).subscribe(value => {
      //console.log("Value after reg: ", value);
      this.showResult = true;
      if (!value) {
        this.result = this.badResult;
      } else {
        this.result = this.goodResult;
      }
    });
    return false;
  }

  passwordsMatchValidation(regForm: FormGroup) {

    let pass1 = regForm.get('password1').value;
    let pass2 = regForm.get('password2').value;
    if ((pass1 != pass2) && (pass2.length > 0)) {
      return {'passwordsnotmatch': true}
    }
    return null;
  }

}
