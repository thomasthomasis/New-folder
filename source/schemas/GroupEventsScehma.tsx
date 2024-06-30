import Realm, {BSON} from 'realm';

export class GroupEvents extends Realm.Object<GroupEvents> {
    _id!: Realm.BSON.ObjectId;
    color?: string;
    endDate?: Date;
    eventId!: string;
    groupId!: string;
    isTraining?: boolean;
    linkTitles!: Realm.List<string>;
    links!: Realm.List<string>;
    name?: string;
    reactions!: Realm.List<string>;
    startDate?: Date;
    usersReacted!: Realm.List<string>;


  static schema: Realm.ObjectSchema = {
    name: 'GroupEvents',
    properties: {
        _id: 'objectId',
        color: 'string?',
        endDate: 'date?',
        eventId: 'string',
        groupId: 'string',
        isTraining: 'bool?',
        linkTitles: 'string[]',
        links: 'string[]',
        name: 'string?',
        reactions: 'string[]',
        startDate: 'date?',
        usersReacted: 'string[]',
    },
    primaryKey: '_id',
  }

};
