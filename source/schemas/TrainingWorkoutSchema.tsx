import Realm, {BSON} from 'realm';

export class TrainingWorkout extends Realm.Object<TrainingWorkout> {
    _id!: Realm.BSON.ObjectId;
    dateCreated?: Date;
    eventId?: string;
    name?: string;
    totalDuration?: number;
    userId!: string;


  static schema: Realm.ObjectSchema = {
    name: 'TrainingWorkout',
    properties: {
        _id: 'objectId',
        dateCreated: 'date?',
        eventId: 'string?',
        name: 'string?',
        totalDuration: 'int?',
        userId: 'string',
    },
    primaryKey: '_id',
  }

};
