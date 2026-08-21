import { client } from './client';

/**
 * One function per backend endpoint. Screens and the store call these and never
 * touch axios directly, so if the API changes, this is the only file to edit.
 *
 *   POST   /practices                  create
 *   GET    /practices                  list
 *   PUT    /practices/{id}             full update
 *   PATCH  /practices/{id}/complete    mark completed
 *   DELETE /practices/{id}             delete
 */

export async function fetchPractices() {
  const { data } = await client.get('/practices');
  return data;
}

export async function createPractice(payload) {
  const { data } = await client.post('/practices', payload);
  return data; // the created practice, including its new id
}

export async function updatePractice(id, payload) {
  const { data } = await client.put(`/practices/${id}`, payload);
  return data;
}

export async function completePractice(id) {
  // PATCH needs no body — the endpoint only flips status to "Completed".
  const { data } = await client.patch(`/practices/${id}/complete`);
  return data;
}

export async function deletePractice(id) {
  // Responds 204 No Content, so there is nothing to return.
  await client.delete(`/practices/${id}`);
}
