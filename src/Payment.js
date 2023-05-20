import React, { useState, useEffect } from 'react';
import './Payment.css'
import CheckoutProduct from './CheckoutProduct';
import { useStateValue } from "./StateProvider";
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
// import { useEffect } from 'react/cjs/react.production.min';
import axios from './axios';
import { Link,  useNavigate } from "react-router-dom";
import { db } from './firebase';
import { Navigate } from "react-router-dom";

const  Payment = () => {

    const navigate = useNavigate();
    
    const [{ basket, user }, dispatch] = useStateValue();
    const stripe = useStripe();
    const elements = useElements();

    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");

    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(true);

    useEffect(() =>{
        const getClientSecrete = async ()=>{
            const response = await axios ({
                method: 'post',
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            });
            setClientSecret(response.data.clientSecret)
        }

        getClientSecrete();

    }, [basket])

    console.log('THE SECRET IS >>>', clientSecret)

    const handleSubmit = async (event) => {
        event.prevenDefault();
        setProcessing(true)

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent }) => {
            // paymentInten = confirmation
            db
            .collection('users')
            .doc(user?.uid)
            .collection('orders')
            .doc(paymentIntent)
            .set({
                basket: basket,
                amount: paymentIntent.amount,
                created: paymentIntent.created
            })
           

            setSucceeded(true);
            setError(null)
            setProcessing(true)

            dispatch({
                type: 'EMPTY_BASKET'
            })
            ||
            <Navigate to="/orders" replace={true} />
            // navigate('/orders')
            
        })
    }
    const handleChange = event => {
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "")
    }
  return (
    <div className='payment'>
        <div className='payment__container'>
            <h1>
                Checkout (<Link to='/checkout'>
                    {basket?.length} items
                    </Link>)
            </h1>
            <div className='payment__section'>
                <div className='payment__title'>
                    <h3>Delivery Address</h3>
                </div>
                <div className='payment__address'>
                    <p>{user?.email}</p>
                    <p>123 React Lane</p>
                    <p>Los Angeles, CA</p>
                </div>
            </div>
            <div className='payment__section'>
            <div className='payment__title'>
                <h3>Rewiew items and delivery</h3>
            </div>
            <div className='payment__items'>
                {basket.map(item => (
                    <CheckoutProduct
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    price={item.price}
                    rating={item.rating}
                    />
                ))}

            </div>
        </div>


            <div className='payment__section'>
            <div className='payment__title'>
                <h3>Payment Method</h3>
            </div>
            <div className='payment__details'>
                    <form onSubmit={handleSubmit}>
                    <CardElement onChange={handleChange}/>

                    <div className='payment__price__container'>
                <CurrencyFormat           
                    renderText={(value) => (
                        <h3>Order Total: {value}</h3>
                    )}
                     decimalScale={2}
                     value={getBasketTotal(basket)}
                     displayType={"text"}
                    thousandSeparator={true}
                     prefix={"$"}
               />
                        <button disabled={processing || disabled || succeeded}>
                            <span>{processing ? <p>Processing </p> :
                            "Buy Now"
                            }</span>
                        </button>
                    </div>
                    {/* ERROR */}
                            {error && <div>{error}</div>}
                    </form>
            </div>

            </div>
            

        </div>
    </div>
  )
}

export default Payment