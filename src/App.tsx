import { Provider as StoreProvider } from "react-redux";

import { Router } from './components';
import { TokenRefresh } from './components/TokenRefresh.tsx';
import store from "./store";
import { UserProvider } from './contexts/user/provider';

function App() {
  return (
    <StoreProvider store={store}>
      <TokenRefresh>
          <UserProvider>
            <Router/>
          </UserProvider>
      </TokenRefresh>
    </StoreProvider>
  )
}

export default App
