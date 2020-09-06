import React, {Component} from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';
import EventsPage from './pages/Events'
import MainNavigation from './components/Navigation/MainNavigation';

class App extends Component {

  state = {
    token : null,
    userId : null
  }

  login = (token, userId, tokenExpiration)=>{
    this.setState({token : token, userId : userId});
  }

  logout = () => {
    this.setState({token : null, userId : null})
  }

  render () {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation/>
            <main className="main-content">
              <Switch>
                <Route path="/" component={EventsPage}/>
              </Switch>
            </main>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
