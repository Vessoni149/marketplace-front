import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavBar } from '../navBar/NavBar.js';
import './userCart.css';
import { ProductCartItem } from './productCartItem/ProductCartItem.js';
import { useNavigate } from 'react-router-dom';
import garbage from '../../assets/icons8-garbage-24.png';
import { LoginCart } from './loginCart/LoginCart.js';
import { AuthContext } from '../../App.js';
import Footer from '../footer/Footer.js';
import { validateAddressFields } from '../../utils/validations.js';
import stripePromise from '../../utils/stripe.js';
import { PaymentForm } from './Payment/PaymentForm.js'; 
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';

//const backUrl= 'https://marketplace-users-ms.onrender.com';
export function UserCart() {

    const [totalPrice, setTotalPrice] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [shipping, setShipping] = useState(0);
    const initializedRef = useRef(false);
    const [cart, setCart] = useState(null);
    const [step, setStep] = useState(1);
    const [errorMessage, setErrorMessage] = useState(null);  
    const navigate = useNavigate();
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
    const [pickupSelected, setPickupSelected] = useState(false);  
    const [totalProductPrice, setTotalProductPrice] = useState(0);
    const [openPaymentForm, setOpenPaymentForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const { loading, setLoading, isAuthenticated} = useContext(AuthContext);
    const [clientSecret, setClientSecret] = useState(null);
    const [currentAddress, setCurrentAddress] = useState({
        postalCode: '',
        state: '',
        city: '',
        street: '',
        streetNumber: '',
        apartment: '',
        betweenStreet1: '',
        betweenStreet2: '',
        workOrResidential: undefined,
        contactNumber: '',
        additionalInstructions: ''
    });


const options = {
    clientSecret,
    appearance: {/* ... configuración de apariencia ... */},
  };

    const handlePayment = async () => {
        setIsSubmitting(true);
        const jwtToken = localStorage.getItem('token');
        try {
        
            if (!cart || cart.length === 0) {
                console.error('Cart is empty or null');
                return;
            }

            const items = cart.map(item => ({
                id: item.productName
            }));
    
            const response = await axios.post('http://localhost:8081/create-payment-intent', {
                amount: totalPrice, 
                items: items
            }, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`, 
                    'Content-Type': 'application/json', 
                }
            });
            
            if(response.status === 200){
                const data = await response.data;
                setClientSecret(data.clientSecret);
                setOpenPaymentForm(true);
            }
        } catch (error) {
            console.error('Error creating payment intent:', error);
        }finally{
            setIsSubmitting(false);
        }
    }; 
    


    const addressesFromLocalStorage = localStorage.getItem('addresses') ?   
    JSON.parse(localStorage.getItem('addresses')) : [];
    const [addresses, setAddresses] = useState(addressesFromLocalStorage);

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);
            const userId = localStorage.getItem('user_id');
            const jwtToken = localStorage.getItem('token');
            if (!userId) {
                setErrorMessage('Please, log in to see your cart.');
                setLoading(false);
                return;
            }
            try {
                
                const response = await fetch(`http://localhost:8081/products/get/${userId}`, {
                //const response = await fetch(`${backUrl}/products/get/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                    credentials: 'include',
                });
                if (response.ok) {
                    const cartData = await response.json();
                    setCart(cartData);
                    localStorage.setItem('cart', JSON.stringify(cartData));
                } else {
                    console.error('Error fetching cart:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            } finally {
                setLoading(false);
            }
        };
    
        if (!initializedRef.current) {
            fetchCart();
            initializedRef.current = true;
        }
    }, [setLoading]);

    useEffect(() => {
        const fetchAddressesFromAPI = async () => {
            try {
            const userId = localStorage.getItem('user_id');
            const jwtToken = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8081/addresses/get/${userId}`, {
            //const response = await fetch(`${backUrl}/addresses/get/${userId}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
                },
            credentials: 'include',
            });
            if (response.ok) {
                const addressesFromAPI = await response.json();
                setAddresses(addressesFromAPI);
                localStorage.setItem('addresses', JSON.stringify(addressesFromAPI));
                } else {
                console.error('Error fetching addresses from API:', response.statusText);
            }
            } catch (error) {
            console.error('Error fetching addresses from API: There are not addresses for this user', error);
            }
        };
        fetchAddressesFromAPI();
        
    }, [step]);

    useEffect(() => {
        if (cart) {
            const calculateShipping = () => {
                if (pickupSelected || totalPrice > 1000) {
                    return 0;
                } else {
                    return 200;
                }
            };
    
            const calculateTotalProductPrice = () => {
                const total = cart.reduce((acc, item) => acc + (item.price * (item.selectedAmount || 1)), 0);
                setTotalProductPrice(total);
            };
    
            const calculateTotalPrice = () => {
                const shippingCost = calculateShipping();
                const total = totalProductPrice + shippingCost;
                setTotalPrice(total);
                setShipping(shippingCost);
            };
    
            const calculateTotalProducts = () => {
                const total = cart.reduce((acc, item) => acc + (item.selectedAmount || 1), 0);
                setTotalProducts(total);
            };
    
            calculateTotalProductPrice();
            calculateTotalPrice();
            calculateTotalProducts();
        }
    }, [cart, pickupSelected, totalProductPrice, totalPrice]);
    

 

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === 'workOrResidential' ? value === 'true' : value;
    
        setCurrentAddress({ ...currentAddress, [name]: newValue });
    };
    
    
    const addAddress = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); 
        if (!validateAddressFields(currentAddress)) {
            setIsSubmitting(false);
            return;
        }
        const userId = localStorage.getItem('user_id');
        const jwtToken = localStorage.getItem('token');
    
        try {
            const response = await axios.post(`http://localhost:8081/addresses/addAddress/${userId}`, 
                { 
                    ...currentAddress 
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                    credentials: 'include',
                }
            );
            
            const newAddress = response.data;
            setAddresses(prevAddresses => {
                const updatedAddresses = [...prevAddresses, newAddress];
                localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
                
                setStep(2);
                return updatedAddresses;
            });
            setIsSubmitting(false);
            setCurrentAddress({
                postalCode: '',
                state: '',
                city: '',
                street: '',
                streetNumber: '',
                apartment: '',
                betweenStreet1: '',
                betweenStreet2: '',
                workOrResidential: undefined,
                contactNumber: '',
                additionalInstructions: ''
            });
        } catch (error) {
            if (error.response) {
                console.error('Error de respuesta del servidor:', error.response.data);
            } else if (error.request) {
                console.error('No se recibió respuesta:', error.request);
            } else {
                console.error('Error al configurar la solicitud:', error.message);
            }
            setIsSubmitting(false);
        }
    };

    const handleAddressSelection = (index) => {
        setSelectedAddressIndex(index);
        setPickupSelected(false); 
    };
    
    const handlePickupSelection = () => {
        setPickupSelected(true);
        setSelectedAddressIndex(null); 
    };

    const handleDeleteAddress = async (addressIndex) => {
        try {
            const userId = localStorage.getItem('user_id');
            const jwtToken = localStorage.getItem('token');
            const addressToDelete = addresses[addressIndex];
            setAddresses((prevAddresses) => {
            const updatedAddresses = prevAddresses.filter((_, index) => index !== addressIndex);
            localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
            const deleteFromAPI = async () => {
                const response = await axios.delete(`http://localhost:8081/addresses/delete/${userId}/${addressToDelete.id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                    credentials: 'include',
                });
                if (response.status !== 200) {
                    console.error('Error deleting address from API:', response.statusText);
                }
            };
            deleteFromAPI();
            return updatedAddresses;
            });
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    if (loading && cart === null) {
        return <div className='loading'>Loading...</div>;
    }

    if (!isAuthenticated && cart === null) {
        return (
            <>
            <LoginCart errorMessage={errorMessage}></LoginCart>
            </>
        );
    }

    return (
        <>
            <NavBar />
            {step === 1 && (
                <h3 className='cart-title'>Products</h3>
            )}
            {step === 2 && (
                <h3 className='cart-title'>Chose the delivery method</h3>
            )}
            <div className='cart-resume-container'>

            {step === 1 && (
                <div className='cart-container'>
                    
                    {
                    cart !== null ? (
                    cart.map((i) => (
                        <ProductCartItem 
                        key={i.code} 
                        cartItem={i} 
                        cart={cart}
                        setCart={setCart}
                        />
                    ))
                    ) : (
                        <>
                    <p className='empty-cart-p'>There are no products in the cart.</p>
                    <span className='empty-cart-sp' onClick={()=>{navigate('/')}}>Go shopping!</span>
                    </>
                    )
                    }
                </div>
            )}
            {step === 2 && (
                <div className='delivery-container'>
                    <div className='delivery-home-conteiner'>
                        
                        {addressesFromLocalStorage.length > 0 ? (
                            <>
                            <span>Send to: </span>
                            {addressesFromLocalStorage.map((a, index) => (

                                <div className='selected-address' key={index}>
                                    <input
                                    type="radio"
                                    name="deliverySelection"
                                    id={`address-${index}`}
                                    checked={index === selectedAddressIndex}
                                    onChange={() => handleAddressSelection(index)}
                                    />
                                    <div className='adrs-street-container'>
                                        <p className='adrs-street-p' onClick={() => handleAddressSelection(index)}>{a.street}, {a.streetNumber} </p>
                                        {a.workOrResidential ? 
                                            <p className='adrs-street-p' onClick={() => handleAddressSelection(index)}>Work</p> 
                                        : 
                                            <p className='adrs-street-p' onClick={() => handleAddressSelection(index)}>Residential</p>
                                        }
                                    </div>
                                    <img className='delete-adrs' src={garbage} alt='Delete' onClick={() => handleDeleteAddress(index)}></img>
                                </div>
                ))}
                            <hr />
                            <span className='other-adrs' onClick={()=>{setStep(3)}}>Choose another address</span>
                            </>
                        ) : (
                            
                            <span className='select-adrs' onClick={()=>{setStep(3)}}>Select address</span>
                            
                            
                            
                        )}
                        
                    </div>

                        <hr />
                        <div className='delivery-point-container'>
                            <input
                                className='delivery-point-input'
                                type="radio"
                                name="deliverySelection"
                                id="dlv-point-lb"
                                checked={pickupSelected}
                                onChange={handlePickupSelection}
                            />
                            <label className='delivery-point-p' htmlFor="dlv-point-lb">Pick up at a delivery point</label>
                        </div>
                </div>
            )}
                {(step === 1 || step === 2) && (
                    <div className='resume-container'>
                    <div className='resume-products'>
                        <p>Products ({totalProducts})</p>
                        <p>$ {totalProductPrice}</p>
                    </div>
                    <div className='resume-shipping'>
                        <p>Shipping</p>
                        {shipping === 0 ? (
                            <p className='free'>Free</p>
                            ) : (
                            <p>$ {shipping}</p>
                        )}
                    </div>
                    <div className='resume-total'>
                        <p><b>Total</b></p>
                            <p><b>{totalPrice}</b></p>
                    </div>
                        <div className='resume-btn'>
                        {step === 1 && (
                            <span className='resume-btn-span'
                            onClick={()=>{setStep(2)}}
                            >Continue shopping</span>
                        )}
                        {step === 2 && (
                        <div className='resume-btns-2'> 
                        <button className='resume-btn-buy-back >'
                            onClick={()=>{setStep(1)}}
                            >Back</button>
                            <button 
                                className={`${!(selectedAddressIndex !== null || pickupSelected) || isSubmitting ?
                                    'resume-btn-buy-back-disabled' : 'resume-btn-buy-back'}`}
                                onClick={() => { handlePayment() }}
                                disabled={!(selectedAddressIndex !== null || pickupSelected) || isSubmitting}
                            >
                                { !isSubmitting ? 'Buy' : '...' }
                            </button>


                            </div> 
                        )}
                    </div>
                </div>
                )}
                {step === 3 && (
                    <>
                    <h3 className='address-form-title'>Add address</h3>
                    <form onSubmit={addAddress} className="adrs-form">
                    <div className="adrs-form-group">
                        <label htmlFor="postalCode" className="adrs-form-label">Postal Code:</label>
                        <input
                            type="number"
                            name="postalCode"
                            id="postalCode"
                            className="adrs-form-input"
                            onChange={handleAddressChange}
                        />
                    </div>
                    <div className="adrs-form-group">
                        <label htmlFor="state" className="adrs-form-label">State:</label>
                        <input
                            type="text"
                            name="state"
                            id="state"
                            className="adrs-form-input"
                            onChange={handleAddressChange}
                        />
                    </div>
                    <div className="adrs-form-group">
                        <label htmlFor="city" className="adrs-form-label">City:</label>
                        <input
                            type="text"
                            name="city"
                            id="city"
                            className="adrs-form-input"
                            onChange={handleAddressChange}
                        />
                    </div>
                    <div className="adrs-form-group">
                        <label htmlFor="street" className="adrs-form-label">Street:</label>
                        <input
                            type="text"
                            name="street"
                            id="street"
                            className="adrs-form-input"
                            onChange={handleAddressChange}
                        />
                    </div>
                    <div className="adrs-form-group">
                        <label htmlFor="streetNumber" className="adrs-form-label">Street Number:</label>
                        <input
                            type="number"
                            name="streetNumber"
                            id="streetNumber"
                            className="adrs-form-input"
                            onChange={handleAddressChange}
                        />
                    </div>
                    <div className="adrs-form-group">
                        <label htmlFor="apartment" className="adrs-form-label">Apartment:</label>
                        <input
                            type="text"
                            name="apartment"
                            id="apartment"
                            className="adrs-form-input"
                            onChange={handleAddressChange}
                        />
                    </div>
                    <div className="adrs-form-group">
                        <label htmlFor="betweenStreet1" className="adrs-form-label">Between Street 1:</label>
                        <input
                            type="text"
                            name="betweenStreet1"
                            id="betweenStreet1"
                            className="adrs-form-input"
                            onChange={handleAddressChange}
                        />
                    </div>
                    <div className="adrs-form-group">
                        <label htmlFor="betweenStreet2" className="adrs-form-label">Between Street 2:</label>
                        <input
                            type="text"
                            name="betweenStreet2"
                            id="betweenStreet2"
                            className="adrs-form-input"
                            onChange={handleAddressChange}
                        />
                    </div>
                    <div className="adrs-form-group">
                        <label htmlFor="workOrResidential" className="adrs-form-label">Work or Residential:</label>
                        <select
                            name="workOrResidential"
                            id="workOrResidential"
                            className="adrs-form-select"
                            onChange={handleAddressChange}
                            required
                        >
                            <option value="">Select</option>
                            <option value="true">Work</option>
                            <option value="false">Residential</option>
                        </select>
                    </div>
                    <div className="adrs-form-group">
                        <label htmlFor="contactNumber" className="adrs-form-label">Contact Number:</label>
                        <input
                            type="number"
                            name="contactNumber"
                            id="contactNumber"
                            className="adrs-form-input"
                            onChange={handleAddressChange}
                        />
                    </div>
                    <div className="adrs-form-group">
                        <label htmlFor="additionalInstructions" className="adrs-form-label">Additional Instructions:</label>
                        <textarea
                            name="additionalInstructions"
                            id="additionalInstructions"
                            className="adrs-form-textarea"
                            onChange={handleAddressChange}
                        />
                    </div>
                    <div className="adrs-form-buttons">
                        <button type="button" className="adrs-form-button" onClick={() => { setStep(2) }}>Previous</button>
                        <button type="submit" className="adrs-form-button"  disabled={isSubmitting}
                        onClick={() => { setStep(3) }}>Confirm</button>
                    </div>
                </form>
                </>
                )}

            {openPaymentForm && (
                <div className='payment-modal'>
                    <button className='close-payment-modal' onClick={()=>{setOpenPaymentForm(false)}}>X</button>
                    <Elements options={options} stripe={stripePromise}>
                        <PaymentForm clientSecret={clientSecret} totalPrice={totalPrice}/>
                    </Elements>
                </div>
)}

            </div>
            <Footer></Footer>
        </>
    );
}
