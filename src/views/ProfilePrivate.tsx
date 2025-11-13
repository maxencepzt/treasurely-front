import { ProfileIdentity } from '../components/profile-page/ProfileIdentity.tsx';
import type { User } from '../types/api.ts';

export function ProfilePrivate({user}: {user: User}) {
  return (
    <ProfileIdentity user={user} />
  )
}