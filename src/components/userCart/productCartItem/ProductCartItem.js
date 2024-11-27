import React, {  useState, useEffect } from 'react'
import './productCartItem.css';
import axios from '../../../utils/AxiosHelper';


export function ProductCartItem({cartItem, setCart, cart}) {
    const [selectedAmount, setSelectedAmount] = useState(cartItem.selectedAmount || 1);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!cartItem.selectedAmount) {
            const updatedCart = cart.map(item => 
                item.code === cartItem.code ? { ...item, selectedAmount: 1 } : item
            );
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    }, [cartItem, cart, setCart]);

    const options = [];
    for (let i = 1; i <= cartItem.amount; i++) {
        options.push(i);
    }

    const handleSelectChange = (event) => {
        const newAmount = parseInt(event.target.value, 10);
        setSelectedAmount(newAmount);

        const updatedCart = cart.map(item => 
            item.code === cartItem.code ? { ...item, selectedAmount: newAmount } : item
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleDelete = async () => {
        const userId = localStorage.getItem('user_id');
        const productCode = cartItem.code;
        const jwtToken = localStorage.getItem('token');
        setIsDeleting(true);
        try {
            const response = await axios.put(`/products/delete/${userId}/${productCode}`, null, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });
            
            console.log(response);
            if (response.status === 200) {
            // Si la solicitud es exitosa, actualiza el estado del carrito y el localStorage
            const newCart = cart.filter(item => item.code !== cartItem.code);
            setCart(newCart);
            localStorage.setItem('cart', JSON.stringify(newCart));
            }
        } catch (error) {
            console.error('Error al eliminar el producto de la base de datos:', error);
        }finally {
            setIsDeleting(false);
        }
    };

    const lowestIdImage = cartItem.image.reduce((lowest, current) => {
        return current.id < lowest.id ? current : lowest;
    }, cartItem.image[0]);

    return (
        <div className='productCart-container'>
            <div className="productCart-image-container">
                <img className="productCart-image" src={lowestIdImage.imageUrl} alt="product" /> 

            </div>
            <div className='productCart-details'>
                <h5 className='productCart-name'>{cartItem.productName}</h5>
                <p className='productCart-desc'>{cartItem.description}</p>
                <div className='productCart-btn-container'>
                <span
                        className={`productCart-btn-span ${isDeleting ? 'disabled' : ''}`}
                        onClick={!isDeleting ? handleDelete : null}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </span>
                </div>
                <div className='productCart-amount-price-container'>
                <div className='amount-container'>
                <select className='amount-input' value={selectedAmount} onChange={handleSelectChange}>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <p className='productCart-amount'>availables: {cartItem.amount}</p>
            </div>
                    <p>unit price:<br></br> ${cartItem.price}</p>
                    <p><b>Total:<br></br> $ {cartItem.price * selectedAmount}</b></p>
                </div>
            </div>
        </div>
    )
}
