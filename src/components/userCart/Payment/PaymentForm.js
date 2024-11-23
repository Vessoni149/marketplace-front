import './paymentForm.css';
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';

export const PaymentForm = ({ clientSecret, totalPrice}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      setError(confirmError.message);
      setProcessing(false);
    } else {
      if (paymentIntent.status === 'succeeded') {
        setPaymentSucceeded(true);
        setError(null);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Successful payment",
          text: "Your order will be processed",
          showConfirmButton: false,
          timer: 2500
      });
      }
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        color: "#000",
        backgroundColor: "#fff",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        margin:"10px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  
  return (
    <form className='payment-form' onSubmit={handleSubmit}>
      <h3>Total amount: {totalPrice}</h3>
        <label className='label-cardType' htmlFor="card-element">
          Credit or debit card
        </label>
        <div className='card-element-container'>
          <CardElement id="card-element" options={cardElementOptions} />
        </div>
      {error && <div className="card-error" role="alert">{error}</div>}
      {paymentSucceeded ? (
        <p className="success-message">Succedded pay!</p>
      ) : (
        <button className='payment-btn' type="submit" disabled={!stripe || processing}>
          {processing ? 'Processing...' : 'Pay'}
        </button>
      )}
    </form>
  );
};
