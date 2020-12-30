//Dependencies
import "bootstrap/dist/css/bootstrap.min.css";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import UserContextProvider from "./context/userContext.js";
import PostContextProvider from "./context/postContext.js"

// pages
import ForumHeader from './pages/header.js'
import Home from './pages/home'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <PostContextProvider>
        <UserContextProvider>
          <ForumHeader />
          <main className="container main-content">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
            </Switch>
          </main>
        </UserContextProvider>          
        </PostContextProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
