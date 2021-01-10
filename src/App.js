import './App.css';
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import MenuBar from './Components/MenuBar';
import { Container } from 'semantic-ui-react';
import { AuthProvider } from './context/auth';
import AuthRoute from './utils/authRoutes';
import SinglePost from './Pages/SinglePost'
function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={ Home }/>
          <AuthRoute exact path="/login" component={ Login }/>
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/post/:id" component={ SinglePost }/>
        </Container>
      </Router>
    </AuthProvider>

  );
}

export default App;
