import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from '../../utils/AxiosHelper';
import { setAuthHeader } from '../../utils/AxiosHelper';
import fetchUserRoles from '../../utils/fetchUserRoles';
import {jwtDecode} from 'jwt-decode';
import './loginForm.css';
import amazonBlackLogo from '../../assets/amazon-black-logo.png';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { validateEmail, validatePassword, validateName, containsUnsafeCharacters } from '../../utils/validations';
import Swal from 'sweetalert2';
import { ReactComponent as OpenEye } from '../../assets/eye.svg';
import { ReactComponent as CloseEye } from '../../assets/closeEye.svg';

import Footer from '../footer/Footer';
export const LoginForm = () => {
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [passwordVisible1, setPasswordVisible1] = useState(false);
    const [passwordVisible2, setPasswordVisible2] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
    });
    const [repeatedPassword, setRepeatedPassword] = useState("");
    const [active, setActive] = useState("login");
    const { setIsAuthenticated } = useContext(AuthContext);

    const togglePasswordVisibility1 = () => {
        setPasswordVisible1(!passwordVisible1);
    };

    const togglePasswordVisibility2 = () => {
        setPasswordVisible2(!passwordVisible2);
    };

    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const onChangeRepeatedPasswordHandler = (event) => {
        setRepeatedPassword(event.target.value);
    };

    const onClickLogo = () => {
        navigate("/");
    };

    const onSubmitLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (containsUnsafeCharacters(formData.email) || containsUnsafeCharacters(formData.password)) {
            const unsafeCharacters = ['<', '>', '=', '(', ')', ';', '&', '"', "'", '/', '\\'];
            Swal.fire({
                icon: "warning",
                title: "Unsafe characters warning",
                text: `Email and password cannot contain unsafe characters: ${unsafeCharacters}`
            });
            setIsSubmitting(false);
            return;
        }

        try {
        

            const response = await axios.post('/login', {
                email: formData.email,
                password: formData.password
            });

            if (response.status === 200) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Logged in!",
                    text: "Welcome " + response.data.fullName,
                    showConfirmButton: false,
                    timer: 2500
                });
                setIsAuthenticated(true);
                const { token } = response.data;
                const loginTime = new Date().toISOString();

                localStorage.setItem('token', token);
                localStorage.setItem('fullName', response.data.fullName);
                localStorage.setItem('email', response.data.Username);
                localStorage.setItem('user_id', response.data.user_id);
                localStorage.setItem('loginTime', loginTime);

                const roles = fetchUserRoles();
                console.log('Roles del usuario después de iniciar sesión:', roles);
                navigate(-1);
            } else {
                console.log(response.statusText);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Invalid email or password."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmitRegister = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const nameError = validateName(formData.fullName);
        if (nameError) {
            Swal.fire({
                icon: "warning",
                title: "Warning in the field 'Full Name'",
                text: nameError
            });
            setIsSubmitting(false);
            return;
        }

        const emailError = validateEmail(formData.email);
        if (emailError) {
            Swal.fire({
                icon: "warning",
                title: "Warning in the field 'Email'",
                text: emailError
            });
            setIsSubmitting(false);
            return;
        }

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            Swal.fire({
                icon: "warning",
                title: "Warning in the field 'Password'",
                text: passwordError
            });
            setIsSubmitting(false);
            return;
        }

        if (formData.password !== repeatedPassword) {
            setPasswordsMatch(false);
            setIsSubmitting(false);
            return;
        }

        if (containsUnsafeCharacters(formData.fullName) || containsUnsafeCharacters(formData.email) || containsUnsafeCharacters(formData.password)) {
            const unsafeCharacters = ['<', '>', '&', '"', "'", '/', '\\'];
            Swal.fire({
                icon: "warning",
                title: "Unsafe characters warning",
                text: `Full name, email, and password cannot contain unsafe characters: ${unsafeCharacters}`
            });
            setIsSubmitting(false);
            return;
        }

        try {

            const response = await axios.post('/createUserEntity', {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            }
            );

            if (response.data.message === 'Email is already in use.') {
                Swal.fire({
                    icon: 'error',
                    title: 'Unsuccessful registry',
                    text: response.data.message
                });
                setIsSubmitting(false);
                return;
            }

            Swal.fire({
                icon: 'success',
                title: 'Registered successfully',
                text: response.data.message
            });
            setActive("login");
            setAuthHeader(response.data.token);
            setPasswordsMatch(true);
        } catch (error) {
            console.error('Error registering user:', error);
            setPasswordsMatch(true);
            setAuthHeader(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const jwtToken = localStorage.getItem('auth_token');
    if (jwtToken) {
        const decodedToken = jwtDecode(jwtToken);
        const roles = decodedToken.roles;
        console.log('Roles del usuario:', roles);
    }

    return (
        <div>
            <div className='menu-logo-container2'>
                <div className='logo-container2'>
                    <img className='logo2' src={amazonBlackLogo} alt="" onClick={onClickLogo} />
                </div>
                <p className='p-logo2' onClick={onClickLogo}>' t</p>
            </div>

            <div className="div-form row justify-content-center">
                <div className="col-8">
                    <ul className="li-buttons nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className={`nav-link ${active === "login" ? "active" : ""}`} id="tab-login"
                                onClick={() => setActive("login")}>Login</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className={`nav-link ${active === "register" ? "active" : ""}`} id="tab-register"
                                onClick={() => setActive("register")}>Register</button>
                        </li>
                    </ul>

                    <div className="tab-content">
                        <div className={`tab-pane fade ${active === "login" ? "show active" : ""}`} id="pills-login">
                            <form onSubmit={onSubmitLogin}>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" className="form-control" onChange={onChangeHandler} />
                                </div>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <input type="password" id="password" name="password" className="form-control" onChange={onChangeHandler} />
                                </div>
                                <div className='send-btn-container'>
                                    <button type="submit" className="send-form-button btn btn-primary btn-block mb-4" disabled={isSubmitting}>{isSubmitting ? 'Signin in...' : 'Sign in'}</button>
                                </div>
                            </form>
                        </div>
                        <div className={`tab-pane fade ${active === "register" ? "show active" : ""}`} id="pills-register">
                            <form onSubmit={onSubmitRegister}>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="fullName">Full name</label>
                                    <input type="text" id="fullName" name="fullName" className="form-control" onChange={onChangeHandler} />
                                </div>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input type="text" id="email2" name="email" className="form-control" onChange={onChangeHandler} />
                                </div>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="registerPassword1">Password</label>
                                    <div className='password-registry-input-container'>
                                        <input
                                            onChange={onChangeHandler}
                                            type={passwordVisible1 ? 'text' : 'password'}
                                            id="registerPassword1"
                                            name="password"
                                            className="form-control password-registry"
                                            placeholder="At least 6 characters"
                                        />
                                        <button type="button" onClick={togglePasswordVisibility1}>
                                            {passwordVisible1 ? <CloseEye /> : <OpenEye />}
                                        </button>
                                    </div>
                                </div>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="registerPassword2">Repeat password</label>
                                    <div className='password-registry-input-container'>
                                        <input
                                            onChange={onChangeRepeatedPasswordHandler}
                                            type={passwordVisible2 ? 'text' : 'password'}
                                            id="registerPassword2"
                                            name="password2"
                                            className="form-control password-registry"
                                            placeholder="At least 6 characters"
                                        />
                                        <button type="button" onClick={togglePasswordVisibility2}>
                                            {passwordVisible2 ? <CloseEye /> : <OpenEye />}
                                        </button>
                                    </div>
                                </div>
                                {!passwordsMatch && <p className="text-danger">Passwords do not match</p>}
                                <div className='send-btn-container'>
                                    <button type="submit" className="send-form-button btn btn-primary btn-block mb-3" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create Account' }</button>
                                </div>
                            </form>
                        </div>
                        <p>By continuing, you agree to <b>Amazon't Terms of Use</b> and <b>Privacy Notice.</b></p>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default LoginForm;
