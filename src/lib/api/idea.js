/* eslint-disable prettier/prettier */

import { apiFetch } from './client.js';

// GET /ideas?difficulty=...&season=...&favorites_only=true
export function listIdeas(filters = {}, token) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, value);
    }
  });

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch(`/ideas${query}`, { token });
}

// POST /ideas  (protected)
export function createIdea(
  {
    title,
    description,
    time_minutes,
    difficulty,
    materials,
    subject,
    season,
    yard_context,
  },
  token,
) {
  return apiFetch('/ideas', {
    method: 'POST',
    token,
    body: {
      title,
      description,
      time_minutes,
      difficulty,
      materials,
      subject,
      season,
      yard_context,
    },
  });
}

// POST /ideas/favorites/:id
export function addFavorite(ideaId, token) {
  return apiFetch(`/ideas/favorites/${ideaId}`, {
    method: 'POST',
    token,
  });
}

// DELETE /ideas/favorites/:id
export function removeFavorite(ideaId, token) {
  return apiFetch(`/ideas/favorites/${ideaId}`, {
    method: 'DELETE',
    token,
  });
}
