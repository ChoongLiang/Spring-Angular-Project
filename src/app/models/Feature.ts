import { FeatureValue} from './FeatureValue';
import { Project } from './Project';

export class Feature{
    id?: number;
    name: string;
    type: string;
    content?: string;
    projectId?: string;
    project?: Project;
    featureValue?: FeatureValue;
    submit?: string;
}