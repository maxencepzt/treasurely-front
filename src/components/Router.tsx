import { Route, Switch } from 'wouter';
import { Index, Login, NotFound } from '../views';

function Router() {
  return(
    <Switch>
      <Route path="/" component={Index}></Route>
      <Route path="/login" component={Login}></Route>

      <Route component={NotFound} />
    </Switch>
  )
}

export default Router;