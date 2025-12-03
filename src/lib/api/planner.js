/* eslint-disable prettier/prettier */

import { apiFetch } from './client.js';

// GET /planner/plans?date=YYYY-MM-DD
export function listPlans({ date } = {}, token) {
  const params = new URLSearchParams();
  if (date) params.set('date', date);
  const query = params.toString() ? `?${params.toString()}` : '';

  return apiFetch(`/planner/plans${query}`, { token });
}

// POST /planner/plans
export function createPlan({ title, date, class_name, notes }, token) {
  return apiFetch('/planner/plans', {
    method: 'POST',
    token,
    body: { title, date, class_name, notes },
  });
}

// GET /planner/plans/:id
export function getPlan(id, token) {
  return apiFetch(`/planner/plans/${id}`, { token });
}

// POST /planner/plans/:id/items
export function addPlanItem(
  planId,
  { idea_id, custom_title, custom_description, start_time, end_time, location },
  token,
) {
  return apiFetch(`/planner/plans/${planId}/items`, {
    method: 'POST',
    token,
    body: {
      idea_id,
      custom_title,
      custom_description,
      start_time,
      end_time,
      location,
    },
  });
}
