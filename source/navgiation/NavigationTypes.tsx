export type RootStackParamList = {
    ProfileScreen: { restrictedView: boolean, userId: string }; // Example parameter for Profile screen
    Account: undefined;
    Home: undefined;
    AddExercise: undefined;
    LogWorkout: undefined;
    LogWorkoutCardio: { continuingWorkout:boolean };
    LogWorkoutResistance: { continuingWorkout:boolean };
    SubmitCompletion: {  levelUp:boolean, gainedXp:number };
    // Add more screens as needed
  };