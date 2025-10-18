import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68d77595f5c9159ea1cb2f1d", 
  requiresAuth: true // Ensure authentication is required for all operations
});
