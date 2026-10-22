import { z } from 'zod';
import { dateString } from '../constants';

export type StrengthExerciseDto = {
  category: string;
  exerciseName?: string;
  sets: number;
  reps: number;
  weightKg?: number;
  restSeconds?: number;
  note?: string;
};

export const strengthExerciseSchema = z.object({
  category: z
    .string()
    .describe(
      'Garmin exercise category in UPPER_SNAKE_CASE (e.g. BENCH_PRESS, SQUAT, DEADLIFT, ROW, SHOULDER_PRESS, LATERAL_RAISE, CURL, TRICEPS_EXTENSION, PULL_UP, LUNGE, PLANK)',
    ),
  exerciseName: z
    .string()
    .optional()
    .describe(
      'Specific exercise variant within the category (e.g. BARBELL_BENCH_PRESS, INCLINE_BARBELL_BENCH_PRESS). Omit to use the generic category exercise',
    ),
  sets: z.number().int().min(1).max(30).describe('Number of sets'),
  reps: z.number().int().min(1).max(200).describe('Repetitions per set'),
  weightKg: z
    .number()
    .min(0)
    .max(500)
    .optional()
    .describe('Working weight in kilograms. Omit or 0 for bodyweight or unspecified'),
  restSeconds: z
    .number()
    .int()
    .min(0)
    .max(900)
    .optional()
    .describe('Rest between sets in seconds. Defaults to 60'),
  note: z.string().max(200).optional().describe('Short note shown on the watch for this exercise'),
});

export type CreateStrengthWorkoutDto = {
  name: string;
  description?: string;
  exercises: StrengthExerciseDto[];
};

export const createStrengthWorkoutSchema = z.object({
  name: z.string().min(1).max(80).describe('Workout name as it will appear in Garmin Connect'),
  description: z.string().max(1000).optional().describe('Optional workout description'),
  exercises: z
    .array(strengthExerciseSchema)
    .min(1)
    .max(50)
    .describe('Exercises in execution order'),
});

export type ScheduleWorkoutDto = {
  workoutId: number;
  date: string;
};

export const scheduleWorkoutSchema = z.object({
  workoutId: z.number().positive().describe('The Garmin workout ID to schedule'),
  date: dateString.describe('Calendar date in YYYY-MM-DD format'),
});

export type DeleteWorkoutDto = {
  workoutId: number;
};

export const deleteWorkoutSchema = z.object({
  workoutId: z.number().positive().describe('The Garmin workout ID to delete'),
});
