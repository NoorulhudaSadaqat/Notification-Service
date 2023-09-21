export interface Application {
  _id?: string;
  name: string;
  description: string;
  code: string;
  isActive?: boolean;
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string;
  modifiedDate?: string;
  isDeleted?: boolean;
}

export interface ApplicationResult {
  applications: Application[];
  totalCount: number;
}
