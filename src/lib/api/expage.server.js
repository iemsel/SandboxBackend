/* eslint-disable prettier/prettier */

import { login } from '$lib/api/auth.js';
import { listIdeas } from '$lib/api/ideas.js';
import { createPlan, addPlanItem } from '$lib/api/planner.js';

async function demoFlow() {
  // 1) login to get token
  const { token, user } = await login({
    email: 'teacher@example.com',
    password: 'secret123',
  });

  console.log('Logged in as', user);

  // 2) get some ideas (e.g. spring, easy)
  const ideas = await listIdeas(
    { season: 'spring', difficulty: 'easy', yard_context: 'no_green' },
    token,
  );

  const firstIdea = ideas[0];
  console.log('Picked idea', firstIdea);

  // 3) create a day plan
  const plan = await createPlan(
    {
      title: 'Spring outdoor lesson',
      date: '2025-03-20',
      class_name: 'Group 6A',
      notes: 'Remember to bring magnifying glasses',
    },
    token,
  );

  console.log('Created plan', plan);

  // 4) add that idea to the plan
  const item = await addPlanItem(
    plan.id,
    {
      idea_id: firstIdea.id,
      start_time: '10:00',
      end_time: '10:45',
      location: 'School yard – paved area',
    },
    token,
  );

  console.log('Plan item created', item);
}
