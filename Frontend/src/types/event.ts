export interface Event {
  _id?: string;
  name: string;
  description: string;
  applicationId: string;
  isActive?: boolean;
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string;
  modifiedDate?: string;
}
