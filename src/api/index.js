import { Get } from '../utils/request';


// neo
export const NGetEntity = param => Get('/api/Entity/graph', param); //ok

export const MGetEntity = param => Get('/api/Entity/message', param); //ok

export const NGetRelation = param => Get('/api/Relation/multiJump', param); //ok

export const NGetEquipmentRank = param => Get('/api/Rank/equipment', param); //ok

export const NGetSituationRank = param => Get('/api/Rank/situation', param); //ok

export const NGetSolutionRank = param => Get('/api/Rank/solution', param); //ok

export const NGetCooperate = param => Get('/api/Relation/cooperate', param); //ok