export interface Notification {
  _id?: string;
  name: string;
  description: string;
  eventId: string;
  templateSubject: string;
  templateBody: string;
  isDeleted?: boolean;
  isActive?: boolean;
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface INotificationEdit {
  name: string;
  templateSubject: Text;
  templateBody: Text;
  createdDate: string;
  modifiedDate: string;
  isActive?: boolean;
}
