import Realm from "realm";

export class Groups extends Realm.Object<Groups> {
    _id!: Realm.BSON.ObjectId;
    dateCreated?: Date;
    description?: string;
    memberRoles!: Realm.List<string>;
    members!: Realm.List<string>;
    membersDateJoined!: Realm.List<Date>;
    name!: string;
    owner?: string;

  static schema: Realm.ObjectSchema = {
    name: 'Groups',
    properties: {
        _id: 'objectId',
        dateCreated: 'date?',
        description: 'string?',
        memberRoles: 'string[]',
        members: 'string[]',
        membersDateJoined: 'date[]',
        name: 'string?',
        owner: 'string?',
    },
  primaryKey: '_id',
}
};

