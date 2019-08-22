import { Project } from './Project';
import { FeatureValue} from './FeatureValue';

export class Feature{
    id?: number;
    name: string;
    type: string;
    content?: string;
    project: Project;
    featureValue?: FeatureValue;
}