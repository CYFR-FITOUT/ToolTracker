
export enum ToolStatus {
  InStock = 'In Stock',
  Issued = 'Issued',
  InRepair = 'In Repair',
}

export interface Tool {
  id: string;
  name: string;
  inventoryCode: string;
  description?: string;
  status: ToolStatus;
  currentHolder?: string;
  currentLocation?: string;
}
