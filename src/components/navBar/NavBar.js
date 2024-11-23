import React, { useState, useContext} from 'react'
import './NavBar.css'
import '../../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faUser,faCartShopping} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import amazonLogo from '../../assets/amazon-logo.jpg';
import {SideBar} from '../sideBar/SideBar';
import Swal from 'sweetalert2'
export function NavBar() {
    
    const [showMenu, setShowMenu] = useState(false);
    const [showBarsMenu, setShowBarsMenu] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    const name = localStorage.getItem("fullName");

    const handleLoginClick = () => {
        navigate('/login'); 
    };

    const handleLogoutClick = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('user_id');
        setIsAuthenticated(false);
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Logged out!",
            text: "See you soon " +  localStorage.getItem('fullName'),
            showConfirmButton: false,
            timer: 2500
        });
        localStorage.removeItem('fullName');
        navigate('/login'); 
    }

    const handleHover = () => {
        setShowMenu(true);
    };

    const handleLeave = () => {
        setShowMenu(false);
    };



    return (
        <>
            <div className='nav-bar-container'>

                <div className='container1'>
                    <div className='menu-logo-container'>
                        <div className='menu'>
                        <FontAwesomeIcon icon={faBars} 
                        className='icon-bars' 
                        onClick={()=>setShowBarsMenu(true)}
                        />
                        </div>

                        <div className='logo-container'>
                            <img onClick={()=>{navigate('/')}} className='logo' src={amazonLogo} alt=""/>
                        </div>
                        <p className='p-logo'>' t</p>
                        
                    </div>


                    <div className='user-cart-container'>
                    
                    <div
                    className='user-icon-container'
                    onMouseEnter={handleHover}
                    onMouseLeave={handleLeave}
                    >
                    <FontAwesomeIcon icon={faUser} className='user' />
                    {showMenu && (
                        <div className='user-menu'>
                        {isAuthenticated && name ? (
                            
                            <h4 className='welcome-menu'>Welcome, {name}!</h4>
                        ) : (
                            <h4 className='welcome-menu'>Welcome, Guest!</h4>
                        )}
                            <hr />
                            <ul className='account-list'>
                                <h5>Your account</h5>
                                <li>Account</li>
                                <li>Orders</li>
                                <li>Claims</li>
                                <li>Search history</li>
                                <li>Memberships and subscriptions</li>
                                <li onClick={()=>navigate("/user-seller")}>Sell in Amazon't</li>
                                {
                                    isAuthenticated && (
                                        <li onClick={()=>navigate("/seller-posts")}>My products for sale</li>
                                    )
                                }
                            </ul>

                            {isAuthenticated === false ? (
                                <button className='login-register-btn' onClick={handleLoginClick}>Login/Register</button>
                            )
                            : (
                            <button className='login-register-btn' onClick={handleLogoutClick}>LogOut</button>
                            )
                            }
                            
                        </div>
                    )}
                    </div>
                        
                        <div className='cart-icon-container'
                            onClick={()=>navigate("/user-cart")}>
                            <FontAwesomeIcon icon={faCartShopping} 
                            className='cart'/>
                        </div>        
                    </div>
                </div>
            
                { showBarsMenu && <SideBar setShowBarsMenu={setShowBarsMenu}/>}
            </div>
        </>
    )
}
