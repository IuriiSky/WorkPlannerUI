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

export interface HolidayDto {
  startDate: string;
  endDate: string;
}

export interface PlanHolidayCommand {
  employeeId: number;
  startDate: string;
  endDate: string;
}

// export interface DeleteHolidayCommand {
//   employeeId: number;
//   startDate: string;
// }
