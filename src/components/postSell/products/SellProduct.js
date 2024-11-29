import React from 'react'
import './sellProduct.css';
import { NavBar } from '../../navBar/NavBar';
import sellProduct from '../../../assets/sell-product.svg';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import upload from '../../../assets/subir.png';
import Swal from 'sweetalert2';
import { validateProductForm, validatePhotoFormat, validatePhotoSize } from '../../../utils/validations';
import { AuthContext } from '../../../App';
import axios from '../../../utils/AxiosHelper';
import {productsUrl} from '../../../utils/AxiosHelper';

export function SellProduct() {
    const { fetchProducts} = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    description: '',
    amount: 0,
    price:0,
    images: [],
    sellerCode: null
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handlePhotoChange = (e) => {
        const filesArray = Array.from(e.target.files);
        const invalidFormatFiles = validatePhotoFormat(filesArray);
        if (invalidFormatFiles.length > 0) {
            Swal.fire({
                icon: "warning",
                title: "Warning in the field 'Images'",
                text: "Invalid file format. Please select only JPG, PNG, or WEBP files."
            });
            return;
        }
    
        const validSizeFiles = validatePhotoSize(filesArray);
        setFormData({
            ...formData,
            images: [...formData.images, ...validSizeFiles]
        });
        setSelectedFiles([...selectedFiles, ...validSizeFiles]);
    };
    
    

    const handleRemove = (index) => {
        const newFiles = [...selectedFiles];
        const newImages = [...formData.images];
        newFiles.splice(index, 1);
        newImages.splice(index, 1);
        setSelectedFiles(newFiles);
        setFormData({ ...formData, images: newImages });
    };
    

    

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'photos') {
            setFormData({ ...formData, [name]: files });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleNext = () => {
        setStep(step + 1);
    };
    const handleCandel = ()=>{
        navigate('/user-seller')
    }

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const isFormValid = validateProductForm(formData);
        if (!isFormValid) {
            return;
        }

    
        setIsSubmitting(true);
            const jwtToken = localStorage.getItem('token');
            if(!jwtToken){
                console.error("JWT not found.");
                return;
        }
        
        const formDataToSend = new FormData();
        formDataToSend.append('productName', formData.productName);
        formDataToSend.append('brand', formData.brand);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('amount', formData.amount);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('sellerCode', localStorage.getItem('user_id'));
        formDataToSend.append('sellerName',localStorage.getItem('fullName'));

        for (const file of formData.images) {
            formDataToSend.append('images', file);
        }
        

        try {
            const response = await axios.post(`${productsUrl}/products/create`, formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });
            
        
            if (response.status === 200) {
                console.log('Formulario enviado exitosamente');
                console.log(formDataToSend);
                setFormData({
                    productName: '',
                    brand: '',
                    description: '',
                    amount: 0,
                    price: 0,
                    images: [],
                    sellerCode: null
                });
                setSelectedFiles([]);
                fetchProducts();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Product Posted!",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/');
            } else {
                console.error('Error al enviar el formulario:', response.statusText);
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error.message);
        }finally {
            setIsSubmitting(false);
        }
    };
    
    
    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            sellerCode: localStorage.getItem('user_id')
        }));
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
            window.removeEventListener('resize', handleResize);
        };
        
    }, []);

    const handleDrop = (e) => {
        e.preventDefault();
        const filesArray = Array.from(e.dataTransfer.files);
        handlePhotoChange({ target: { files: filesArray } });
    };



    return (
        <>
        <NavBar></NavBar>
            <div className='top-background'>
                <div className='step-container'>
                    <p className='step-p'>Step {step} of 3</p>
                </div>
                <div className='h4-img-container'>
                    <h4>Tell us, what do you want to sell?</h4>
                    <img src={sellProduct} alt="Products" />
                </div>
                
            </div>
            <div className='bot-background'>
                    {step === 1 && (
                        <div className='product-form-container-step1'>
                        <form className='product-form' onSubmit={handleSubmit}>
                            <h5 className='form-title-step1'>Complete the product data.</h5>
                            <div className='label-input-form-container'>
                                <label className="product-form-label"
                                htmlFor="productName">Product Name (required)</label>
                                <input
                                className="product-form-input"
                                type="text"
                                id="productName"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                required
                                />
                            </div>
                            <div className='label-input-form-container'>
                                <label className="product-form-label" htmlFor="brand">Brand (required)</label>
                                <input
                                className="product-form-input"
                                type="text"
                                id="brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                />
                            </div>
                            
                            <div className='price-amount-container'>
                                <div className='label-input-form-container price-div'>
                                    <label className="product-form-label" htmlFor="price">Unit price (required)</label>
                                    <input
                                className="product-form-input"
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                />
                                </div>
                                <div className='label-input-form-container amount-div'>
                                    <label className="product-form-label" htmlFor="amount">Amount (required)</label>
                                    <input
                                className="product-form-input"
                                type="number"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                    />
                                </div>
                            </div>
                            
                            <div className='product-form-btn-container'>
                                <button className='product-form-btn'
                                onClick={handleCandel}>Cancel</button>
                                <button className='product-form-btn' type="button" onClick={handleNext}>Next</button>
                            </div>
                        </form>
                        </div>
                    )}


                    {step === 2 && (
                    
                        <div className='product-form-container-step2'>
                            <div className='features-h5-p-container'>
                                <h5 className='features-form-h5'>Main features.</h5>
                                <p className='features-form-p'>Complete this information with the manufacturer's specifications.{windowWidth > 768 ? (
                                    <p >You can use the box or packaging of the product to check the information.</p>) 
                                    : null
                                }</p> 
                            </div>

                            <form className='features-form' onSubmit={handleSubmit}>
                                    <label
                                    
                                    htmlFor="description">Description:</label>
                                    <textarea
                                    className='ta-description'
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    placeholder='Ex: Color, size, model...'
                                    />
                                    <div className='product-form-btn-container'>
                                        <button className='product-form-btn' type="button" onClick={handlePrevious}>Previous</button>
                                        <button className='product-form-btn' type="button" onClick={handleNext}>Next</button>
                                    </div>
                                    
                                
                                
                        </form>
                    </div>
                    )}

                {step === 3 && (
                        
                        <form className='product-form-container-step3' onSubmit={handleSubmit}>
                            <div>
                                <h5>Photos.</h5>
                                <p>Post from 1 to 6 photos. The first one must have preferably a white background color. It will the main photo.</p>
                            </div>
                            {selectedFiles.length > 0 ? (
                                <>
                                <div className="thumbnails">
                                {selectedFiles.map((file, index) => (
                                        <div className="thumbnail" key={index}>
                                            <img className='thumbnails-img' src={URL.createObjectURL(file)} alt={`Thumbnail ${index}`} />
                                            <span className='thumbnail-btn' type="button" onClick={() => handleRemove(index)}>X</span>
                                        </div>
                                        
                                    
                                ))}
                                {selectedFiles.length < 6 ? (
                                        <div className="upload-thumbnail" onClick={() => inputRef.current.click()} onDrop={handleDrop}  onDragOver={(e) => e.preventDefault()}>
                                            <input
                                            type="file"
                                            id="photos"
                                            name="photos"
                                            multiple
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            style={{ display: 'none' }}
                                            ref={inputRef}
                                            />
                                            <img className='upload-img' src={upload} alt="upload" />
                                        </div>
                                        ) : null }
                                        </div>
                                </>
                                ) : (
                                <div className="file-upload" onClick={() => inputRef.current.click()}
                                onDrop={handleDrop}  onDragOver={(e) => e.preventDefault()}>
                                    <input
                                    type="file"
                                    id="photos"
                                    name="photos"
                                    multiple
                                    accept="image/jpeg, image/png, image/webp"
                                    onChange={handlePhotoChange}
                                    style={{ display: 'none' }}
                                    ref={inputRef}
                                    />
                                    <p>Drag & drop or click to select files</p>
                                    <p>Acceptable formats: JPG, PNG or WebP</p>
                                    <p>Max. size: 10MB</p>
                                </div>
                            )}
                            <div className='product-form-btn-container'>
                                <button className='product-form-btn' type="button" onClick={handlePrevious}>Previous</button>
                                <button className='product-form-btn' type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Publishing...' : 'Publish'}
                            </button>
                            </div>
                        </form>
                )}
                
            </div>
        </>
    )
}
