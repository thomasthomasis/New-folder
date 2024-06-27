import Realm from "realm";

export class Groups extends Realm.Object<Groups> {
    _id!: Realm.BSON.ObjectId;
    color?: string;
    dateCreated?: Date;
    description?: string;
    groupId!: string;
    image?: string;
    memberRoles!: Realm.List<string>;
    members!: Realm.List<string>;
    membersDateJoined!: Realm.List<Date>;
    name!: string;
    owner?: string;
    sport?: string;

  static schema: Realm.ObjectSchema = {
    name: 'Groups',
    properties: {
        _id: 'objectId',
        color: 'string?',
        dateCreated: 'date?',
        description: 'string?',
        groupId: 'string',
        image: 'string?',
        memberRoles: 'string[]',
        members: 'string[]',
        membersDateJoined: 'date[]',
        name: 'string?',
        owner: 'string?',
        sport: 'string?',
    },
  primaryKey: '_id',
}
};

