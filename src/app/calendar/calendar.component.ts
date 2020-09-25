import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ViewEncapsulation} from '@angular/core';
import { DatePipe } from '@angular/common';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation : ViewEncapsulation.None,
})
export class CalendarComponent  implements OnInit {

  @Output() selectedDate = new EventEmitter<Date>();

  constructor(private datepipe: DatePipe)  { }

    //days:string[] = ["Man","Tir","Ons","Tor","Fre","Lør","Søn"];
    days:string[] = ["Ma","Ti","On","To","Fr","Lø","Sø"];
    moths:string[] = ["Januar","Februar","Marts","April","Maj","Juni","Juli","August","September","Oktober","November","December"];

    currentDateSubject : BehaviorSubject<Date>;
    currentDate: Date;

    currentWeekDay: number;
    currentMonthDay: number;
    currentWeek: number;
    currentMonth: string;
    

    getWeekNumber(d: Date) : number {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
      let yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
      let newLocal = d.getTime() - yearStart.getTime();
      var weekNo = Math.ceil(( ( newLocal / 86400000) + 1)/7);
      return weekNo;
    }

    isDaySelected(day:number){
      return day === this.currentWeekDay;
    }

    moveCurrentDate(days:number) {
      let date = new Date(this.currentDate.getTime());
      date.setDate(this.currentDate.getDate() + days);
      this.selectedDateChanged(date); 
    }

    nextWeek() {
      this.moveCurrentDate(7);
    }

    nextFourWeek() {
      this.moveCurrentDate(28);
    }

    previousWeek() {
      this.moveCurrentDate(-7);
    }

    previousFourWeek() {
      this.moveCurrentDate(-28);
    }

    daySelected(day:number){
      let diff = day - this.currentWeekDay;

      if (diff != 0) {
        this.moveCurrentDate(diff);
      }
    }

    dateChangeFromCalendar(event: MatDatepickerInputEvent<Date>) {
      let newDate = new Date(event.value);
      this.selectedDateChanged(newDate);
    }

    selectedDateChanged(date:Date){
      this.currentDate = date;
      this.currentDateSubject.next(date);
    }

    getDayOfWeek(date: Date):number {
      return date.getDay() == 0 ? 6 : date.getDay() - 1;
    }

    listenToDateChanged(){
      this.currentDateSubject.subscribe((date:Date)=>{
        this.currentWeek = this.getWeekNumber(date);
        this.currentMonth = this.moths[date.getMonth()];
        this.currentMonthDay = date.getDate();
        this.currentWeekDay = this.getDayOfWeek(date);
        this.selectedDate.emit(date);
      })
    }

  ngOnInit() {
    this.currentDate = new Date();
    this.currentDateSubject = new BehaviorSubject<Date>(this.currentDate);
    this.listenToDateChanged();
  }
}