import { Provider as StoreProvider } from "react-redux";

import { Router } from './components';
import store from "./store";

function App() {
  return (
    <StoreProvider store={store}>
      <Router />
    </StoreProvider>
  )
}

export default App
