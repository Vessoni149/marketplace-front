import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import ProductItem from './productItem/ProductItem';
import './ProductList.css'


export function ProductList({products, filter, setCart, cart}) {
    
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
    const productsPerPage = 8; // Número de productos por página

    useEffect(() => {
        const arrayFiltered = products.filter((element) =>{
            if (filter.length > 0) {
                return element.productName.toLowerCase().includes(filter.toLowerCase());
            } else {
            return true;
        }
        });
        setFilteredProducts(arrayFiltered);
        setCurrentPage(1);
    }, [filter, products]);


    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

 // Cambia de página
 const paginate = (pageNumber) => setCurrentPage(pageNumber);

 // Calcula el número total de páginas
 const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
        <div className='product-list'>
            <div className="products" id="products">
            {currentProducts.map((product) => (
                <ProductItem key={product.id} product={product} setCart={setCart} cart={cart} btnBuyerOrSeller={true} />
            ))}
            </div>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
ProductList.propTypes = {
    products: PropTypes.array,
    filter:PropTypes.string,
};