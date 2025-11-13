import type { SyntheticEvent } from 'react';

import { type User } from "../types/api";

function UserProfilePicture({ userData, size = 64 }: { userData?: User, size?: number }) {
  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = "/user_profile_picture_default.png";
  };

  return (
    <div className="flex justify-center">
      <img
        src={userData?.profilePicture || "/user_profile_picture_default.png"}
        alt={userData?.nickname || "Default avatar"}
        style={{ width: size, height: size, borderRadius: '50%'}}
        onError={handleImageError}
      />
    </div>
  );
}

export default UserProfilePicture;
