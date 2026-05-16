import type { AuthMeResponse } from '../types';
import { apiRequest } from './http';

export function fetchCurrentUser() {
  return apiRequest<AuthMeResponse>('/auth/me');
}
