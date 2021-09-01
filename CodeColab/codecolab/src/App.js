import EditorContainer from './EditorContainer.js'
import HomePage from './HomePage.js'
import {
  BrowserRouter as Router,
  Switch,
  Route} from 'react-router-dom';
function App() {

   return(
    <Router>
    <Switch>
      <Route path="/" exact component={HomePage}></Route>
      <Route path="/room/:id"  exact component={EditorContainer}>
      </Route>
    </Switch>
  </Router>
   )
}

export default App;
