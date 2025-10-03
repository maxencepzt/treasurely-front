import Router from './components/Router.tsx';

function App() {

  return (
    <div className="flex justify-center items-center h-screen m-0 bg-gray-50">
      <header></header>
      <main className="w-full max-w-md px-4">
        <Router />
      </main>
      <footer></footer>
    </div>
  )
}

export default App
