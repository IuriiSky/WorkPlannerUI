export interface Employee {
  id: number;
  name: string;
  colorCode: string;
}

export interface EmployeeDetails {
  id: number;
  name: string;
  colorCode: string;
  holidays: Holiday[];
}

export interface CreateEmployee {
  employeeName: string;
  colorCode: string;
}

export interface  UpdateEmployee {
  employeeId: number;
  employeeName:	string;
  colorCode:	string;
}
export interface Holiday{
  startDate: string,
  endDate: string,
}
