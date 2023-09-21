export interface Event {
  _id?: string;
  name: string;
  description: string;
  applicationId: string;
  isActive?: boolean;
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string;
  isDeleted?: boolean;

  modifiedDate?: string;
}

export interface EventResult {
  applications: Event[];
  totalCount: number;
}
