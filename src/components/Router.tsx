import { BrowserRouter, Route,Routes } from "react-router";

import { Index, Login, UserUploadProfilePicture } from '../views';
import ErrorView from '../views/Error.tsx';
import ErrorRouteWrapper from '../views/ErrorRouteWrapper.tsx';
import Profile from '../views/profile/Profile.tsx';
import TeamMembers from '../views/teams/TeamMembers.tsx';
import Teams from "../views/teams/Teams.tsx";
import TreasureHunt from "../views/treasure-hunt/TreasureHunt.tsx";
import Riddle from "../views/riddle/Riddle.tsx";

function Router() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/upload" element={<UserUploadProfilePicture/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/profile/:id" element={<Profile/>} />
        <Route path="/error" element={<ErrorRouteWrapper />} />
        <Route path="/treasure-hunt/:id" element={<TreasureHunt />} />
        <Route path="/riddle/:id" element={<Riddle />} />
        <Route path="/teams/:id" element={<Teams />} />
        <Route path="/teams/:id/members" element={<TeamMembers />} />

        <Route path="*" element={<ErrorView status={404} message="Page introuvable" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;