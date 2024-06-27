import Realm, {BSON} from 'realm';

export class GroupEvents extends Realm.Object<GroupEvents> {
    _id!: Realm.BSON.ObjectId;
    color?: string;
    date?: Date;
    eventId!: string;
    groupId!: string;
    linkTitles!: Realm.List<string>;
    links!: Realm.List<string>;
    name?: string;
    reactions!: Realm.List<string>;
    usersReacted!: Realm.List<string>;


  static schema: Realm.ObjectSchema = {
    name: 'GroupEvents',
    properties: {
        _id: 'objectId',
        color: 'string?',
        date: 'date?',
        eventId: 'string',
        groupId: 'string',
        linkTitles: 'string[]',
        links: 'string[]',
        name: 'string?',
        reactions: 'string[]',
        usersReacted: 'string[]',
    },
    primaryKey: '_id',
  }

};
