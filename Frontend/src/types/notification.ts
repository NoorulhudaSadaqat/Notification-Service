export interface Notification {
  name: string;
  description: string;
  eventId: string;
  templateSubject: string;
  templateBody: string;
  isActive?: boolean;
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string;
  modifiedDate?: string;
}
