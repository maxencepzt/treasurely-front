import { BrowserRouter, Route,Routes } from "react-router";

import { Index, Login, NotFound, UploadImage } from '../views';
import ErrorRouteWrapper from '../views/ErrorRouteWrapper.tsx';

function Router() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/upload" element={<UploadImage/>} />
        <Route path="/error" element={<ErrorRouteWrapper />} />

        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;