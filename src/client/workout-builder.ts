import { StrengthExerciseDto } from '../dtos';

const STRENGTH_SPORT_TYPE = {
  sportTypeId: 5,
  sportTypeKey: 'strength_training',
  displayOrder: 5,
};

const REPEAT_STEP_TYPE = { stepTypeId: 6, stepTypeKey: 'repeat', displayOrder: 6 };
const INTERVAL_STEP_TYPE = { stepTypeId: 3, stepTypeKey: 'interval', displayOrder: 3 };
const REST_STEP_TYPE = { stepTypeId: 5, stepTypeKey: 'rest', displayOrder: 5 };

const ITERATIONS_END_CONDITION = {
  conditionTypeId: 7,
  conditionTypeKey: 'iterations',
  displayOrder: 7,
  displayable: false,
};
const REPS_END_CONDITION = {
  conditionTypeId: 10,
  conditionTypeKey: 'reps',
  displayOrder: 10,
  displayable: true,
};
const TIME_END_CONDITION = {
  conditionTypeId: 2,
  conditionTypeKey: 'time',
  displayOrder: 2,
  displayable: true,
};

const NO_TARGET = {
  workoutTargetTypeId: 1,
  workoutTargetTypeKey: 'no.target',
  displayOrder: 1,
};
const NO_STROKE = { strokeTypeId: 0, strokeTypeKey: null, displayOrder: 0 };
const NO_EQUIPMENT = { equipmentTypeId: 0, equipmentTypeKey: null, displayOrder: 0 };
const KILOGRAM_UNIT = { unitId: 8, unitKey: 'kilogram', factor: 1000 };

const DEFAULT_REST_SECONDS = 60;

function buildWorkStep(exercise: StrengthExerciseDto, stepOrder: number, childStepId: number) {
  return {
    type: 'ExecutableStepDTO',
    stepOrder,
    stepType: INTERVAL_STEP_TYPE,
    childStepId,
    description: exercise.note ?? null,
    endCondition: REPS_END_CONDITION,
    endConditionValue: exercise.reps,
    preferredEndConditionUnit: null,
    endConditionCompare: '',
    targetType: NO_TARGET,
    targetValueOne: null,
    targetValueTwo: 0,
    targetValueUnit: null,
    zoneNumber: null,
    secondaryTargetType: null,
    secondaryTargetValueOne: null,
    secondaryTargetValueTwo: null,
    secondaryTargetValueUnit: null,
    secondaryZoneNumber: null,
    endConditionZone: null,
    strokeType: NO_STROKE,
    equipmentType: NO_EQUIPMENT,
    category: exercise.category,
    exerciseName: exercise.exerciseName ?? '',
    workoutProvider: null,
    providerExerciseSourceId: null,
    weightValue: exercise.weightKg ?? 0,
    weightUnit: KILOGRAM_UNIT,
  };
}

function buildRestStep(restSeconds: number, stepOrder: number, childStepId: number) {
  return {
    type: 'ExecutableStepDTO',
    stepOrder,
    stepType: REST_STEP_TYPE,
    childStepId,
    description: null,
    endCondition: TIME_END_CONDITION,
    endConditionValue: restSeconds,
    preferredEndConditionUnit: null,
    endConditionCompare: '',
    targetType: NO_TARGET,
    targetValueOne: null,
    targetValueTwo: 0,
    targetValueUnit: null,
    zoneNumber: null,
    secondaryTargetType: null,
    secondaryTargetValueOne: null,
    secondaryTargetValueTwo: null,
    secondaryTargetValueUnit: null,
    secondaryZoneNumber: null,
    endConditionZone: null,
    strokeType: NO_STROKE,
    equipmentType: NO_EQUIPMENT,
    category: null,
    exerciseName: null,
    workoutProvider: null,
    providerExerciseSourceId: null,
    weightValue: -1,
    weightUnit: KILOGRAM_UNIT,
  };
}

export function buildStrengthWorkoutPayload(
  name: string,
  exercises: StrengthExerciseDto[],
  description?: string,
): Record<string, unknown> {
  let stepOrder = 0;

  const workoutSteps = exercises.map((exercise, index) => {
    const childStepId = index + 1;
    const groupOrder = ++stepOrder;
    const workStep = buildWorkStep(exercise, ++stepOrder, childStepId);
    const restStep = buildRestStep(
      exercise.restSeconds ?? DEFAULT_REST_SECONDS,
      ++stepOrder,
      childStepId,
    );

    return {
      type: 'RepeatGroupDTO',
      stepOrder: groupOrder,
      stepType: REPEAT_STEP_TYPE,
      childStepId,
      numberOfIterations: exercise.sets,
      workoutSteps: [workStep, restStep],
      endCondition: ITERATIONS_END_CONDITION,
      endConditionValue: exercise.sets,
      preferredEndConditionUnit: null,
      endConditionCompare: null,
      skipLastRestStep: false,
      smartRepeat: false,
    };
  });

  return {
    sportType: STRENGTH_SPORT_TYPE,
    subSportType: null,
    workoutName: name,
    description: description ?? null,
    estimatedDurationInSecs: 0,
    avgTrainingSpeed: 0,
    estimateType: null,
    estimatedDistanceUnit: { unitId: null, unitKey: null, factor: null },
    isSessionTransitionEnabled: null,
    workoutSegments: [
      {
        segmentOrder: 1,
        sportType: STRENGTH_SPORT_TYPE,
        poolLength: null,
        poolLengthUnit: null,
        avgTrainingSpeed: null,
        estimatedDurationInSecs: null,
        estimatedDistanceInMeters: null,
        estimatedDistanceUnit: null,
        estimateType: null,
        description: null,
        workoutSteps,
      },
    ],
  };
}
