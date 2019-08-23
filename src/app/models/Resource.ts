import { Feature } from './Feature';
import { Project } from './Project';

export class Resource {
  id?: number;
  name: string;
  code: string;
  projectId?: string;
  project?: Project;
  features?: Feature[];
  editable?: boolean;
  submit?: string;
}