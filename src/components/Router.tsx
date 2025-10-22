import { BrowserRouter, Routes, Route } from "react-router";
import { Index, Login, NotFound } from '../views';

function Router() {
  return(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Index/>}></Route>
            <Route path="/login" element={<Login/>}></Route>

            <Route path="*" element={<NotFound/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default Router;