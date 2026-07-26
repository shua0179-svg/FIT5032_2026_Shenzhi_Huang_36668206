// Simple front-end role mapping for the FIT5032 lab (7.2 HD task).
// Firebase Email/Password auth does not store a "role" itself, so we map
// each registered email to a role here. Register these emails first via the
// Fire Register page, then sign in with each to demonstrate multiple roles.
export type Role = 'admin' | 'user' | 'guest'

export const roleMap: Record<string, Role> = {
  'admin@test.com': 'admin',
  'user@test.com': 'user',
}

export function getRole(email: string | null | undefined): Role {
  if (!email) return 'guest'
  return roleMap[email] ?? 'guest'
}
