import { Project } from './Project';
import { Feature } from './Feature';

export class Resource {
  id?: number;
  name: string;
  code: string;
  project: Project
  features?: Feature[];
}