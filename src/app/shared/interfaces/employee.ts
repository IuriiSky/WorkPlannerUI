export interface EmployeeDto {
  id: number;
  name: string;
  colorCode: string;
}

export interface EmployeeDetailsDto {
  id: number;
  name: string;
  colorCode: string;
  holidays: HolidayDto[];
}

export interface CreateEmployeeCommand {
  employeeName: string;
  colorCode: string;
}

export interface  UpdateEmployeeCommand {
  employeeId: number;
  employeeName:	string;
  colorCode:	string;
}
export interface HolidayDto{
  startDate: Date,
  endDate: Date,
}

export class PlanHolidayCommand {
  employeeId: number;
  startDate: Date;
  endDate: Date;
}
export class DeleteHolidayCommand {
  employeeId: number;
  startDate: Date;
}
