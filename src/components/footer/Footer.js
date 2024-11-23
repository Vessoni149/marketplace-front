import React from 'react';
import './footer.css'; // Asegúrate de crear y usar el archivo CSS para los estilos

const Footer = () => {
    return (
        <div className="nav-footer-info-wrapper">
            <div className="nav-footer-primaryinfo">
                <small className="nav-footer-copyright">
                    Copyright ©&nbsp;1994-2024 Agustin Vessoni
                </small>
                <nav className="nav-footer-navigation">
                    <ul className="nav-footer-navigation__menu">
                        <li className="nav-footer-navigation__item">
                            <a href="https://careers-meli.mercadolibre.com/?utm_campaign=site-mla&utm_source=mercadolibre&utm_medium=mercadolibre" className="nav-footer-navigation__link">
                                Trabajá con nosotros
                            </a>
                        </li>
                        <li className="nav-footer-navigation__item">
                            <a href="https://www.mercadolibre.com.ar/ayuda/terminos-y-condiciones-de-uso_991" className="nav-footer-navigation__link">
                                Términos y condiciones
                            </a>
                        </li>
                        <li className="nav-footer-navigation__item">
                            <a href="https://www.mercadolibre.com.ar/l/promociones" className="nav-footer-navigation__link">
                                Promociones
                            </a>
                        </li>
                        <li className="nav-footer-navigation__item">
                            <a href="https://www.mercadolibre.com.ar/privacidad" className="nav-footer-navigation__link">
                                Cómo cuidamos tu privacidad
                            </a>
                        </li>
                        <li className="nav-footer-navigation__item">
                            <a href="https://www.mercadolibre.com.ar/accesibilidad" className="nav-footer-navigation__link">
                                Accesibilidad
                            </a>
                        </li>
                        <li className="nav-footer-navigation__item">
                            <a href="https://www.mercadolibre.com.ar/ayuda/18697" className="nav-footer-navigation__link">
                                Información al usuario financiero
                            </a>
                        </li>
                        <li className="nav-footer-navigation__item">
                            <a href="https://www.mercadolibre.com.ar/ayuda" className="nav-footer-navigation__link">
                                Ayuda
                            </a>
                        </li>
                        <li className="nav-footer-navigation__item">
                            <a href="https://www.mercadolibre.com.ar/ayuda/Defensa-del-Consumidor_s20014" className="nav-footer-navigation__link">
                                Defensa del Consumidor
                            </a>
                        </li>
                        <li className="nav-footer-navigation__item">
                            <a href="https://www.mercadolibre.com.ar/ayuda/23303" className="nav-footer-navigation__link">
                                Información sobre seguros
                            </a>
                        </li>
                        <li className="nav-footer-navigation__item">
                            <a href="https://www.mercadolibre.com.ar/hot-sale" className="nav-footer-navigation__link">
                                Hot Sale
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <p className="nav-footer-secondaryinfo">
                Av. Cruz del Sur 5000, Piso 3, CP 48080, Rinconada de La Calma, Zapopan
            </p>
        </div>
    );
};

export default Footer;
