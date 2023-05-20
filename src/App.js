import React, { useEffect } from 'react'
import './App.css';
import Header from './Header';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Checkout from './Checkout';
import Login from './Login';
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import Payment from './Payment';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Orders from './Orders';


const stripePromise = loadStripe(
  "pk_test_51Kqf2lKm80cFhxTT3bYhfbgqsdxKap6TAaTexbxaWZ5352pGPWVouaZnG1JkpYcfRKn8sO3U3p47xqfyIsFtLPz200wY8gjzp0"
)

function App() {
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    // will only run once when the app component loads.....
      
    auth.onAuthStateChanged(authUser => {
      console.log('THE UER IS >>> ', authUser);

      if(authUser){
        // the user just logged in / the user was logged in

        dispatch({
          type: 'SET_USER',
          user: authUser
        })
      } else {
        // the user is logged out
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }
    })
  }, [])
 

  return (
  <Router>
    <Header/>   
    <Routes>
    <Route path='/login' element={<Login/>}/>
    <Route path='/orders' element={<Orders/>}/>
    <Route path='/payment' element={<Elements stripe={stripePromise}>
    <Payment/> 
    </Elements>
    }/>
    <Route exact path="/" element={<Home/>}/>
  
    <Route exact path="/" element={<Header/>}/>
    <Route path="/Checkout" element={<Checkout/>}/>
      </Routes>
    </Router>
  );
}

export default App;
