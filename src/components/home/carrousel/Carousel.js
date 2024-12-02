import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './carousel.css'; 
import carouselPromo1 from '../../../assets/carouselPromo1.webp';
import carouselPromo2 from '../../../assets/carouselPromo2.webp';
import carouselPromo3 from '../../../assets/carouselPromo3.webp';
import carouselPromo4 from '../../../assets/carouselPromo4.webp';

const Carousel = () => {
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay:true,
        autoplaySpeed:4000,
        arrows: true,
    };

    useEffect(() => {
        // Forzar la actualización del componente
        window.dispatchEvent(new Event('resize'));

        // Verificar si las imágenes se han cargado
        const imageList = [carouselPromo1, carouselPromo2, carouselPromo3, carouselPromo4];
        let loadedCount = 0;

        imageList.forEach((src) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === imageList.length) {
                    setImagesLoaded(true);
                }
            };
        });
    }, []);

    if (!imagesLoaded) {
        return <div>Loading...</div>; // Puedes reemplazar esto con un spinner u otro indicador de carga
    }

    return (
        <div className='bg-carousel'>
            <div className="carousel-container">
                <Slider {...settings}>
                    <div key="slide1">
                        <a href="https://listado.mercadolibre.com.ar/_Container_tecnodeals-ce-junio">
                            <img src={carouselPromo1} alt="SELECCIONADOS EN ELECTRO: HASTA 35% OFF Y 9 CUOTAS SIN INTERÉS" />
                        </a>
                    </div>
                    <div key="slide2">
                        <a href="https://www.mercadolibre.com.ar/ofertas/copa-america-2024">
                            <img src={carouselPromo2} alt="Conmegol copa ameríca, las mejores ofertas para vivír el fútbol. hasta 30% off y hasta 12 cuotas sin interés" />
                        </a>
                    </div>
                    <div key="slide3">
                        <a href="https://www.mercadolibre.com.ar/c/accesorios-para-vehiculos">
                            <img src={carouselPromo3} alt="ofertas a prueba de frío: todo para tu vehículo. hasta 35% off y 9x sin interés" />
                        </a>
                    </div>
                    <div key="slide4">
                        <a href="https://www.mercadolibre.com.ar/ofertas/especial-skincare">
                            <img src={carouselPromo4} alt="Descubrí tu rutina de skincare. Hasta 40% off y hasta 6 cuotas sin interés" />
                        </a>
                    </div>
                </Slider>
            </div>
        </div>
    );
};

export default Carousel;
