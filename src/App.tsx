import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import BookmarkPage from './pages/BookmarkPage';
import DetailPage from './pages/DetailPage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/bookmark">
          <BookmarkPage />
        </Route>
        <Route path="/detail">
          <DetailPage />
        </Route>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="*">
          <h1>Page Not Found</h1>
        </Route>
      </Switch>
    </Router>
  );
}
