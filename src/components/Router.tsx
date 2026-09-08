import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { Index, Login } from '../views';
import ErrorView from '../views/error/Error.tsx';
import ErrorRouteWrapper from '../views/error/ErrorRouteWrapper.tsx';
import Profile from '../views/profile/Profile.tsx';
import Riddle from '../views/riddle/Riddle.tsx';
import AccountSettings from "../views/settings/AccountSettings.tsx";
import PasswordSettings from "../views/settings/PasswordSettings.tsx";
import Settings from "../views/settings/Settings.tsx";
import TeamCreate from '../views/teams/TeamCreate.tsx';
import TeamMembers from '../views/teams/TeamMembers.tsx';
import Teams from "../views/teams/Teams.tsx";
import TeamsIndex from '../views/teams/TeamsIndex.tsx';
import TreasureHunt from "../views/treasure-hunt/TreasureHunt.tsx";
import TreasureHuntsList from "../views/treasure-hunt/TreasureHuntsList.tsx";
import AppShell from './AppShell.tsx';

function Router() {
  return(
    <BrowserRouter>
      <AppShell>
      <Routes>
        <Route path="/" element={<Index/>} />
        <Route path="/login" element={<Login/>} />
        {/* Pas encore d'inscription en ligne : les anciens liens mènent à la connexion */}
        <Route path="/signup" element={<Navigate to="/login" replace />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/profile/:id" element={<Profile/>} />
        <Route path="/error" element={<ErrorRouteWrapper />} />
        <Route path="/treasure-hunt" element={<TreasureHuntsList />} />
        <Route path="/settings/profile/:id" element={<Settings />} />
        <Route path="/settings/profile/:id/account" element={<AccountSettings />} />
        <Route path="/settings/profile/:id/password" element={<PasswordSettings />} />
        <Route path="/treasure-hunt/:id" element={<TreasureHunt />} />
        <Route path="/riddle/:id" element={<Riddle />} />
        <Route path="/teams" element={<TeamsIndex />} />
        <Route path="/teams/new" element={<TeamCreate />} />
        <Route path="/teams/:id" element={<Teams />} />
        <Route path="/teams/:id/members" element={<TeamMembers />} />

        <Route path="*" element={<ErrorView status={404} message="Page introuvable" />} />
      </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default Router;