import { BrowserRouter, Route,Routes } from "react-router";

import { Index, Login, UploadImage } from '../views';
import ErrorView from '../views/Error.tsx';
import ErrorRouteWrapper from '../views/ErrorRouteWrapper.tsx';
import Profile from '../views/Profile.tsx';
import TreasureHunt from "../views/treasure-hunt/TreasureHunt.tsx";
import Profile from '../views/profile/Profile.tsx';

function Router() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/upload" element={<UploadImage/>} />
        <Route path="/profile/:userId" element={<Profile/>} />
        <Route path="/profile/:id" element={<Profile/>} />
        <Route path="/error" element={<ErrorRouteWrapper />} />
        <Route path="/treasure-hunt/:id" element={<TreasureHunt />} />

        <Route path="*" element={<ErrorView status={404} message="Page introuvable" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;