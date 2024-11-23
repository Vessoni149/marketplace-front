import React from 'react'
import { ProductList } from './productList/ProductList';
import { useState, useContext} from 'react';
import { NavBar } from '../navBar/NavBar.js';
import { faSearch} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './home.css';
import { AuthContext } from '../../App.js';
import Footer from '../footer/Footer.js';
import Carousel from './carrousel/Carousel.js';

export function Home({setCart, cart}) {
    
    const [filter, setFilter] = useState(''); 
    const [inputValue, setInputValue] = useState("Busca en Amazon' t");
    const [inputClass,setInputClass] = useState('input-light-text')
    const { products, loading } = useContext(AuthContext);
    
    
    

    


    const handleChange = (e) => {
        const value = e.target.value;
        setInputClass('input-dark-text');
        setInputValue(value);
        setFilter(value);

        if(value.lenght === 0){
            setInputValue("Busca en Amazon' t");
            setInputClass('input-light-text');
        }
    };
    const handleFocus = () => {
        if(inputValue === "Busca en Amazon' t"){
            setInputValue('');
        }
    };
    const handleBlur = ()=>{
        setInputValue("Busca en Amazon' t");
        setInputClass('input-light-text');
    }

    if (loading) {
        return <div className='loading'>Loading...</div>;
    }

    return (
        <>
            
            <div>
                <NavBar></NavBar>
                 {/* parte inferior de la barra */}
                <div className='filters-bar'>
                    <div className='input-container'>
                        <input type="text" name="" id="" 
                        className={inputClass}
                        onChange={handleChange} 
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        value={inputValue}
                        />
                        
                        <button>
                        <FontAwesomeIcon icon={faSearch} className='search-icon'/>
                        </button>
                    </div>
                </div>
                
                <Carousel></Carousel>
                
                <ProductList products={products} filter={filter}
                setCart={setCart} cart={cart}></ProductList>
            </div>
                <Footer></Footer>
        </>
    )
}
