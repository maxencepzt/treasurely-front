import { BrowserRouter, Route,Routes } from "react-router";

import { Index, Login, UserUploadProfilePicture } from '../views';
import ErrorView from '../views/error/Error.tsx';
import ErrorRouteWrapper from '../views/error/ErrorRouteWrapper.tsx';
import Profile from '../views/profile/Profile.tsx';
import Riddle from '../views/riddle/Riddle.tsx';
import AccountSettings from "../views/settings/AccountSettings.tsx";
import PasswordSettings from "../views/settings/PasswordSettings.tsx";
import Settings from "../views/settings/Settings.tsx";
import TeamMembers from '../views/teams/TeamMembers.tsx';
import Teams from "../views/teams/Teams.tsx";
import TreasureHunt from "../views/treasure-hunt/TreasureHunt.tsx";
import TreasureHuntsList from "../views/treasure-hunt/TreasureHuntsList.tsx";

function Router() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/profile/:id" element={<Profile/>} />
        <Route path="/error" element={<ErrorRouteWrapper />} />
        <Route path="/treasure-hunt" element={<TreasureHuntsList />} />
        <Route path="/settings/profile/:id" element={<Settings />} />
        <Route path="/settings/profile/:id/upload" element={<UserUploadProfilePicture/>} />
        <Route path="/settings/profile/:id/account" element={<AccountSettings />} />
        <Route path="/settings/profile/:id/password" element={<PasswordSettings />} />
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