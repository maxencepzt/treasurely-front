import { Provider as StoreProvider } from "react-redux";

import { Router } from './components';
import { TokenRefresh } from './components/TokenRefresh.tsx';
import store from "./store";

function App() {
  return (
    <StoreProvider store={store}>
      <TokenRefresh>
          <Router />
      </TokenRefresh>
    </StoreProvider>
  )
}

export default App
