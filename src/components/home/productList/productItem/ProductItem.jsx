import React, { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import './productItem.css';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../../App';
import { useNavigate } from 'react-router-dom';
import { handleAddToCart } from '../../../../utils/cartUtil';
import axios from '../../../../utils/AxiosHelper';
import {productsUrl} from '../../../../utils/AxiosHelper';

const ProductItem = ({ product , btnBuyerOrSeller}) => {

    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderContainerRef = useRef(null);
    const userId = localStorage.getItem("user_id");
    const sortedImages = product.image.slice().sort((a, b) => a.id - b.id);
    const productCode = product.code;
    const { isAuthenticated, loading, setLoading, fetchProducts} = useContext(AuthContext);
    const navigate = useNavigate();


    



    const truncateDescription = (text, maxLength) => {
        const trimmedText = text.replace(/\n/g, ' ');
        if (trimmedText.length <= maxLength) {
            return trimmedText;
        }
        return `${trimmedText.slice(0, maxLength)}...`;
    };

    useEffect(() => {
        const handleResize = () => {
            setCurrentSlide(0); 
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % product.image.length); 
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + product.image.length) % product.image.length); 
    };

    const goToSlide = (index) => {
        setCurrentSlide(index); 
    };

    const deleteFromSale = async ()=>{
        if(isAuthenticated){
                try {
                    const jwtToken = localStorage.getItem('token');
                            const response = await axios.delete(`${productsUrl}/products/delete/${productCode}`, {
                                headers: {
                                    'Authorization': `Bearer ${jwtToken}`,
                                },
                            });
                            
                    if (response.status === 200) {
                        fetchProducts();
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Product deleted.",
                            showConfirmButton: false,
                            timer: 1000
                        });
                    } else {
                        console.error('Error deleting products:', response.status);
                    }
                    } catch (error) {
                    console.error('Error deleting products:', error);
                } finally{
                    setLoading(false);
                }
            };
        }
    
        const handleDescription = () => {
            navigate(`/product/${product.code}`); // Navega a la página de detalles del producto
        };

    return (
        <div className="product_card">
            <div className="image_slider">
                <button className="prev" onClick={prevSlide}>&lt;</button>
                <div
                    className="slider_container"
                    ref={sliderContainerRef}
                    style={{ transform: `translateX(-${(currentSlide * (100))}%)` }}
                >
                    {sortedImages.map((i, index) => (
                        <div className="slide" key={index}>
                            <img className="product_image" src={i.imageUrl} alt={product.name}  onClick={handleDescription}/>
                        </div>
                    ))}
                </div>
                <button className="next" onClick={nextSlide}>&gt;</button>
            </div>
            <div className="dots"> {/* Contenedor de los puntos de navegación */}
                {sortedImages.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${currentSlide === index ? 'active' : ''}`} 
                        onClick={() => goToSlide(index)} 
                    ></span>
                ))}
            </div>
            <div className="product_info">
                <h4 className="product_name">{product.productName}</h4>
                <h5 className='product_brand'>{product.brand}</h5>
                <p className="product_description" onClick={handleDescription}>
                    {truncateDescription(product.description, 50)}
                </p>
                <div className="product_details">
                    <p className="product_price">
                        $ {product.price}
                    </p>
                    {!btnBuyerOrSeller? (
                        <button className='product_btn'
                        onClick={deleteFromSale}
                        disabled={loading}>
                            Delete
                        </button>
                        
                    ) : (
                        <button
                        className='product_btn'
                        onClick={() => handleAddToCart(productCode, userId, setLoading)}
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add to cart'}
                    </button>
                    )}
                    
                </div>
                <p className='product_seller_p'>Seller: <span className='seller_name'>{product.sellerName}</span></p>
            </div>
        </div>
    );
};

ProductItem.propTypes = {
    product: PropTypes.object,
};

export default ProductItem;
