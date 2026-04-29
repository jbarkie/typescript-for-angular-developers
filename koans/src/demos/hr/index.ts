import { fail } from "assert";
import { none, Option, some } from "./option";
import { Results, succeeded } from "./results";

declare const brand: unique symbol;
export type Brand<T, TBrand> = T & { [brand]: TBrand}



type Employee = {
    id: string;
    name: string;
}
type Department = {
    id: string;
};
type BrandedEmployee = Brand<Employee, "Employee">;
type BrandedDepartment = Brand<Department, "Department">;

export function getEmployeeById(id: string): Option<BrandedEmployee> {
  if(id === '999') {
    return none;
  }
  return some({
    id,
    name: 'Test Employee',
  } as BrandedEmployee);
}

export function getDepartments(): BrandedDepartment[] {
  return [{ id: 'Dev' } as BrandedDepartment, { id: 'QA' } as BrandedDepartment, { id: 'Sales' } as BrandedDepartment]
}

export function transferEmployee(
  employeeId: string, 
  departmentId: string) {
    // do the transfer.
  }

  export function transferEmployee2(dept:BrandedDepartment, emp:BrandedEmployee) {

  }

export function giveEmployeeRaise(emp:BrandedEmployee) {

}

type HiringRequest = Brand<Employee, 'EmployeeHiringRequest'>;
export function hire(name:string) {
    return {
      id: crypto.randomUUID(), // uuid
      name
    } as HiringRequest;
}

type AssignedEmployee = Brand<Employee, "EmployeeAssignedDepartment">;
export function assignDepartment(emp:HiringRequest, dep: BrandedDepartment) {
  // do something.
  return emp as unknown as AssignedEmployee;
}
export function saveNewEmployee(emp: AssignedEmployee ) : Results<string> {
  //return fail('Did not work')
  return succeeded("did it");
}
