import ProductCard from "../ProductCard/index.jsx"; 
import styles from './ProductSection.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import { useEffect, useState, useRef } from "react"; 


function ProductSection({ }) {

    const [ products, setProducts ] = useState([]);

    // Setas
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        const buscarProdutos = async () => {
            try {
                const API_URL = 'http://localhost:5000/api/produtos'; 
                
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error(`Erro HTTP! Status: ${response.status}`);
                }
                
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        }
        buscarProdutos();
    }, []);

    return (

        <section className={styles.productSection}>
            <h1>Nossos Produtos</h1>
            
            {products.length > 0 ? (
                
                <div className={styles.swiperWrapper}> 
                    
                    <div 
                        ref={prevRef} 
                        className={`${styles.customNavButton} swiper-button-prev`} 
                    />
                    <div 
                        ref={nextRef} 
                        className={`${styles.customNavButton} swiper-button-next`} 
                    />

                    <Swiper
                        className={styles.cardsSwiper}
                        modules={[Grid, Navigation]}
                        slidesPerView={4} 
                        grid={{
                            rows: 2, 
                            fill: 'row',
                        }}

                        // Navegação Customizada
                        onInit={(swiper) => {
                            // Conecta as Refs com a navegação do Swiper
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                            swiper.navigation.init();
                            swiper.navigation.update();
                        }}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                            enabled: true,
                        }}
                    >                        
                        {
                            products.map((prod, index) => {

                                if (!prod || !prod.name) {
                                    return null;
                                }
                                
                                return (
                                    <SwiperSlide key={prod._id || index}> 
                                        <ProductCard 
                                            key={prod._id || index} 
                                            name={prod.name} 
                                            price={prod.price} 
                                            image={prod.image} 
                                            size={prod.size} 
                                            productId={prod._id}
                                        />
                                    </SwiperSlide>

                                );
                            })
                        }
                    </Swiper>
                </div>
            ) : (
                <p>Carregando produtos...</p>
            )}
        </section>
    );
}

export default ProductSection;