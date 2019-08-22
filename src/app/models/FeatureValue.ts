import { Project } from './Project';
import { Resource } from './Resource';
import { Feature } from './Feature';

export class FeatureValue {
    id?: number;
    value: string;
    project: Project;
    resource: Resource;
    feature: Feature;
}