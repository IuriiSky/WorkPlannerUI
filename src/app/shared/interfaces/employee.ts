export interface EmployeeDto {
  id: number;
  name: string;
  colorCode: string;
}

export interface EmployeeDetailsDto {
  id: number;
  name: string;
  isActive: boolean;
  colorCode: string;
  holidays: HolidayDto[];
}

export interface CreateEmployeeCommand {
  employeeName: string;
  colorCode: string;
  login: string,
  password: string,
  departmentId: number
}

export interface  UpdateEmployeeCommand {
  employeeId: number;
  employeeName:	string;
  colorCode:	string;
}
export interface  UpdateEmployeeCredentialsCommand {
  employeeId: number;
  password:	string;
  isActive:	boolean;
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
