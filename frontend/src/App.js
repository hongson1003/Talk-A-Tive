import './App.css';
import {
  Switch,
  Route,
} from "react-router-dom";
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

const App = () => {
  return (
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route path="/chat">
        <ChatPage />
      </Route>
    </Switch>


  );
}

export default App;
