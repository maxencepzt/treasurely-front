import { Router } from './components';
import { Provider as StoreProvider } from "react-redux";
import store from "./store";

function App() {
  return (
    <StoreProvider store={store}>
      <div className="flex justify-center items-center h-screen m-0 bg-gray-50">
        <header></header>
        <main className="w-full max-w-md px-4">
          <Router />
        </main>
        <footer></footer>
      </div>
    </StoreProvider>
  )
}

export default App
