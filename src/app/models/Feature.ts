import { FeatureValue} from './FeatureValue';
import { Project } from './Project';

export class Feature{
    name: string;
    type: string;
    content?: string;
    id?: number;
    projectId?: string;
    project?: Project;
    featureValue?: FeatureValue;
    submit?: string;
}