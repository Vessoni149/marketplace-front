import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './productDetail.css';
import { NavBar } from '../../navBar/NavBar';
import { useNavigate } from 'react-router-dom';
import { handleAddToCart } from '../../../utils/cartUtil';
import { AuthContext } from '../../../App';
import Footer from '../../footer/Footer';
export const ProductDetail = ({ products }) => {
    const { productId } = useParams();
    const { setLoading} = useContext(AuthContext);
    const product = products.find(p => p.code === parseInt(productId)); 
    const [mainImage, setMainImage] = useState(product.image[0].imageUrl); 
    const navigate = useNavigate();
    const userId = localStorage.getItem("user_id");
    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <>
        <NavBar></NavBar>
            <div className="product-detail">
            <div className="back-arrow-container" onClick={() => navigate('/')}>
                    <span className='back-arrow'>&larr;</span>
            </div>
            <div className="product-detail-container">
                <div className="product-detail-images">
                    <div className="thumbnail-detail-images">
                        {product.image.map((img, index) => (
                            <img
                                key={index}
                                className="thumbnail-detail"
                                src={img.imageUrl}
                                alt={product.productName}
                                onMouseEnter={() => setMainImage(img.imageUrl)}
                            />
                        ))}
                    </div>
                        <img className="main-image" src={mainImage} alt={product.productName} />
                    </div>
                    <div className="product-info">
                        <h1 className="product-name">{product.productName}</h1>
                        <h2 className="product-brand">{product.brand}</h2>
                        <p className="product-price">${product.price}</p>
                        <p className="product-description">{product.description}</p>
                        <button className="add-to-cart" onClick={()=>{ handleAddToCart(productId, userId, setLoading); navigate('/user-cart')}}>Add to Cart</button>
                        <p className="seller-info">Sold by: {product.sellerName}</p>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
        
    );
};
