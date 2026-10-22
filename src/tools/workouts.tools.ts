import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { GarminClient } from '../client';
import {
  createStrengthWorkoutSchema,
  scheduleWorkoutSchema,
  deleteWorkoutSchema,
} from '../dtos';

export function registerWorkoutTools(server: McpServer, client: GarminClient): void {
  server.registerTool(
    'create_strength_workout',
    {
      description:
        'Create a strength training workout in Garmin Connect and sync it to the watch. Each exercise becomes a set group with its own reps, weight and rest. Use get_workout on an existing workout to discover valid category and exerciseName values',
      inputSchema: createStrengthWorkoutSchema.shape,
    },
    async ({ name, description, exercises }) => {
      const data = await client.createStrengthWorkout(name, exercises, description);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.registerTool(
    'schedule_workout',
    {
      description: 'Schedule an existing workout on a calendar date so it appears on the watch',
      inputSchema: scheduleWorkoutSchema.shape,
    },
    async ({ workoutId, date }) => {
      const data = await client.scheduleWorkout(workoutId, date);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.registerTool(
    'delete_workout',
    {
      description: 'Delete a workout permanently. This action cannot be undone',
      inputSchema: deleteWorkoutSchema.shape,
    },
    async ({ workoutId }) => {
      const data = await client.deleteWorkout(workoutId);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(data ?? 'Workout deleted', null, 2) }],
      };
    },
  );
}
