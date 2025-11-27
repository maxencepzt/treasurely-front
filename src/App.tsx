import { Provider as StoreProvider } from "react-redux";

import { InstallPWA, Router } from './components';
import { TokenRefresh } from './components/TokenRefresh.tsx';
import { UserProvider } from './contexts/user/provider';
import store from "./store";

function App() {
  return (
    <StoreProvider store={store}>
      <TokenRefresh>
          <UserProvider>
            <Router/>
            <InstallPWA />
          </UserProvider>
      </TokenRefresh>
    </StoreProvider>
  )
}

export default App
