import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private object : String = null;

  constructor() { }

  getObject(){
    return this.object;
  }

  setObject(ob : String){
    this.object = ob;
  }
}
