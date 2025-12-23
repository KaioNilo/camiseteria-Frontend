import ProductCard from "../ProductCard/index.jsx";
import styles from './ProductSection.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { useEffect, useState, useRef } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://camiseteria-backend.onrender.com';

function ProductSection() {
    const [products, setProducts] = useState([]);
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        const buscarProdutos = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/produtos`);
                if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        }
        buscarProdutos();
    }, []);

    return (
        <section id="produtos" className={styles.productSection}>
            <h1 className={styles.heading}>Nossos Produtos</h1>
           
            {products.length > 0 ? (
                <div className={styles.container}>
                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        loop={true}
                        slidesPerView={'auto'}
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 100,
                            modifier: 2.5,
                            slideShadows: false,
                        }}
                        pagination={{ el: `.${styles.swiperPagination}`, clickable: true }}
                        navigation={{
                            nextEl: nextRef.current,
                            prevEl: prevRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        modules={[EffectCoverflow, Pagination, Navigation]}
                        className={styles.swiper_container}
                    >                        
                        {products.map((prod, index) => (
                            prod?.name && (
                                <SwiperSlide key={prod._id || index} className={styles.swiperSlide}>
                                    <ProductCard
                                        name={prod.name}
                                        price={prod.price}
                                        image={prod.image}
                                        size={prod.size}
                                        productId={prod._id}
                                    />
                                </SwiperSlide>
                            )
                        ))}

                        <div className={styles.sliderControler}>
                            <div ref={prevRef} className={`${styles.sliderArrow} swiper-button-prev`}>
                                <ion-icon name="arrow-back-outline"></ion-icon>
                            </div>
                            <div className={`${styles.swiperPagination} swiper-pagination`}></div>
                            <div ref={nextRef} className={`${styles.sliderArrow} swiper-button-next`}>
                                <ion-icon name="arrow-forward-outline"></ion-icon>
                            </div>
                        </div>
                    </Swiper>
                </div>
            ) : (
                <p>Carregando produtos...</p>
            )}
        </section>
    );
}

export default ProductSection;