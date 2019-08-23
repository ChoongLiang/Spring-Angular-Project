import { Project } from './Project';
import { Feature } from './Feature';
import { Resource } from './Resource';

export class FeatureValue {
    id?: number;
    value: string;
    projectId?: string;
    resourceId?: string;
    featureId?: string;
    project?: Project;
    feature?: Feature;
    resource?: Resource;
    submit?: string;
}