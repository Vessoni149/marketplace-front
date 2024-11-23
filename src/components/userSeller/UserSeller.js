import { useContext, useState } from 'react';
import { NavBar } from '../navBar/NavBar';
import './userSeller.css';
import { AuthContext } from '../../App';
import emailjs from 'emailjs-com';
import fetchUserRoles from '../../utils/fetchUserRoles';
import house from '../../assets/house.svg';
import car from '../../assets/car_front.svg';
import shoe from '../../assets/shoe_side.svg';
import service from '../../assets/paint_can.svg';
import { useNavigate } from 'react-router-dom';
import Footer from '../footer/Footer';
import Swal from 'sweetalert2';

export function UserSeller() {
    const { isAuthenticated } = useContext(AuthContext);
    const [overlayStatus, setOverlayStatus] = useState({
        vehicles: "none",
        estate: "none",
        services: "none"
    });
    const name = localStorage.getItem("fullName");
    const email = localStorage.getItem("email");
    const navigate = useNavigate();
    emailjs.init(process.env.REACT_APP_EMAILJS_USER_ID);

    const validateRoles = () => {
        const roles = fetchUserRoles();
        return roles.includes('USER_SELLER');
    }

    const sendEmail = () => {
        const form = document.createElement('form');
        form.style.display = 'none'; // Ocultar el formulario

        // Crear campos del formulario
        const inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.name = 'from_name';
        inputName.value = name;
        form.appendChild(inputName);

        const inputEmail = document.createElement('input');
        inputEmail.type = 'email';
        inputEmail.name = 'from_email';
        inputEmail.value = email;
        form.appendChild(inputEmail);

        // Agregar formulario al DOM
        document.body.appendChild(form);

        emailjs.sendForm('service_udglofi', 'template_36kdrbc', form)
            .then((result) => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Permission request email send successfully.",
                    showConfirmButton: false,
                    timer: 1500
                });
            }, (error) => {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error sending permission request.",
                    showConfirmButton: false,
                    timer: 1500
                });
            });
    };

    return (
        <>
            <NavBar />
            {isAuthenticated && validateRoles() ? (
                <>
                    <div className='top-container'>
                        <h2 className='seller-db-title'>Welcome to the seller dashboard {name}!</h2>
                        <p>What do you want to sell in Amazon't?</p>
                    </div>

                    <div className='bot-container'>
                        <div className='img-categories-container'>
                            <div onClick={() => { navigate('/sell-product') }} className='categories-img-p-container'>
                                <img src={shoe} alt="Products" />
                                <p className='p-products'>Products</p>
                            </div>
                            <div
                                className='categories-img-p-container'
                                onMouseEnter={() => setOverlayStatus(prev => ({ ...prev, vehicles: "block" }))}
                                onMouseLeave={() => setOverlayStatus(prev => ({ ...prev, vehicles: "none" }))}
                            >
                                <img src={car} alt="Vehicles" className='disabled-img' />
                                <div className='overlay' style={{ display: overlayStatus.vehicles }}>In Development</div>
                                <p className='p-disabled'>Vehicles</p>
                            </div>
                            <div
                                className='categories-img-p-container '
                                onMouseEnter={() => setOverlayStatus(prev => ({ ...prev, estate: "block" }))}
                                onMouseLeave={() => setOverlayStatus(prev => ({ ...prev, estate: "none" }))}
                            >
                                <img src={house} alt="Estate" className='disabled-img' />
                                <div className='overlay' style={{ display: overlayStatus.estate }}>In Development</div>
                                <p className='p-disabled'>Estate</p>
                            </div>
                            <div
                                className='categories-img-p-container '
                                onMouseEnter={() => setOverlayStatus(prev => ({ ...prev, services: "block" }))}
                                onMouseLeave={() => setOverlayStatus(prev => ({ ...prev, services: "none" }))}
                            >
                                <img src={service} alt="Services" className='disabled-img' />
                                <div className='overlay' style={{ display: overlayStatus.services }}>In Development</div>
                                <p className='p-disabled'>Services</p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className='top-container'>
                        <h2 className='seller-db-title'>Welcome to the seller dashboard.</h2>
                        <p className='seller-db-p1'>If you want to sell in this website, you must request permission by clicking here:</p>
                    </div>
                    <div className='bot-container'>
                        <button onClick={sendEmail} className='seller-db-btn-permission'>Request permission</button>
                        <div className='seller-db-p2-container'>
                            <p className='seller-db-p2'>When you get the permission, you could publish products to sell in Amazon't. This is a security measure to prevent malicious overloading of images to our repositories.</p>
                        </div>
                    </div>
                </>
            )}
            <Footer />
        </>
    );
}
