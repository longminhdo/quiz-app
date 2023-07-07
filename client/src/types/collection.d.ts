export interface Collection {
  _id: string;
  title: string;
  questions: [any];
  owner: string;
  deleted: boolean;
  createdAt: number;
  updatedAt: number;
  __v: number;
}
