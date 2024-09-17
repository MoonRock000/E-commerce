import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Orders from './pages/Orders';
import Cart from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currUser = JSON.parse(localStorage.getItem('user'));
    if (currUser) {
      setUser(currUser);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <CartProvider>
      <Router>
        <Header user={user} setUser={setUser} />
        <Routes>
          <Route path='/' element={<Home user={user} />} />
          <Route
            path='/login'
            element={
              <GuestRoute user={user}>
                <Login setUser={setUser} />
              </GuestRoute>
            }
          />
          <Route
            path='/signup'
            element={
              <GuestRoute user={user}>
                <Signup setUser={setUser} />
              </GuestRoute>
            }
          />
          <Route
            path='/orders'
            element={
              <ProtectedRoute user={user}>
                <Orders user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path='/cart'
            element={
              <ProtectedRoute user={user}>
                <Cart />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
};

export default App;
