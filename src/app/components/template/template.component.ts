import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  numbers: any[] = [];

  constructor() { }

  ngOnInit() {
    this.numbers
  }

  add(){
    console.log(typeof this.numbers);
    this.numbers.push("1");
    console.log(this.numbers);
  }

  reduce(){
    this.numbers.pop();
  }
  
  returnValue(){
    
  }

}
