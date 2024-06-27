export type RootStackParamList = {
    ProfileScreen: { restrictedView: boolean, userId: string }; // Example parameter for Profile screen
    Account: undefined;
    Home: undefined;
    AddExercise: undefined;
    LogWorkout: undefined;
    LogWorkoutCardio: { continuingWorkout:boolean };
    LogWorkoutResistance: { continuingWorkout:boolean };
    SubmitCompletion: {  levelUp:boolean, gainedXp:number };
    SocialScreen: undefined;
    CreateGroup: undefined;
    JoinGroup: undefined;
    GroupMembersSettings: { group:string };
    GroupSettings: { group:string };
    Group: { group:string };
    WorkoutDisplay: { data:any, dataType:string };
    History: { group:string };
    AppSettings: undefined;
    ProfileSettings: undefined;
    Feedback: undefined;
    EditResistanceExercise: { exercise:string };
    EditCardioExercise: { exercise:string };
    GroupEvents: { group:string };
    GroupEvent: { event:string };
    CreateGroupEvent: { group:string };
    EditGroupEvent: { event:string };
    // Add more screens as needed
  };