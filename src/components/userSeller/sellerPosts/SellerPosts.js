import React, { useContext} from 'react';
import { NavBar } from '../../navBar/NavBar';
import ProductItem from '../../home/productList/productItem/ProductItem';
import { AuthContext } from '../../../App.js';
import './sellerPost.css';
import Footer from '../../footer/Footer.js';

export function SellerPosts() {
    const name = localStorage.getItem("fullName");
    const userId = localStorage.getItem("user_id");
    const { products, isAuthenticated} = useContext(AuthContext);
    const filteredProducts = products.filter(product => product.sellerCode.toString() === userId.toString());


    return (
        <>
        {isAuthenticated && (
            <>
                <NavBar />
                
                <div className='top-container'>
                    <h2 className='seller-db-title'>Welcome to the seller dashboard {name}!</h2>
                    <p>Your products for sale:</p>
                </div>
                
                <div className='bot-container'>
                    <div className='products-seller-list'>
                        {filteredProducts.map((product) => (
                            <ProductItem key={product.id} product={product} btnBuyerOrSeller={false} />
                        ))}
                    </div>
                </div>
            </>
        )}
        <Footer></Footer>
    </>
    )
}
