import { Route, Switch } from 'wouter';
import { Index, Login, NotFound } from '../views';
import UploadImage from '../views/UploadImage';

function Router() {
  return(
    <Switch>
      <Route path="/" component={Index}></Route>
      <Route path="/login" component={Login}></Route>
      <Route path="/upload" component={UploadImage}></Route>

      <Route component={NotFound} />
    </Switch>
  )
}

export default Router;