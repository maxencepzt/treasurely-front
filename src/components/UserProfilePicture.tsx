import {type user} from "../types/api";

function UserProfilePicture({userData}:{userData?: user}) {
  return (
    <div className="flex justify-center">
      <img src={userData ? "http://localhost:8000" + userData.profilePicture : "/user_profile_picture_default.png"} alt="Photo de profil"
           className="w-24 h-24 rounded-full border-4 border-white shadow-md"/>
    </div>
  )
}

export default UserProfilePicture;