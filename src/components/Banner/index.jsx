import styles from './Banner.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination } from 'swiper/modules';

import Banner1 from '../../assets/Banner-1.png';
import Banner2 from '../../assets/Banner-2.png';
import Banner3 from '../../assets/Banner-3.png';


function Banner({}) {

    const data = [
        {id: '1', image: Banner1},
        {id: '2', image: Banner2},
        {id: '3', image: Banner3},
    ]

    return (
        <section className={styles.banner}>

            <Swiper
                modules={[EffectFade, Autoplay, Pagination]}
                effect="fade"
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false
                }}
                pagination={{
                    clickable: true,
                }}
            >
                {data.map(item => (
                    <SwiperSlide key={item.id}>
                        <img src={item.image} alt="Banner"
                        className='slide-item'/>
                    </SwiperSlide>
                ))}
            </Swiper>

        </section>
    )
}

export default Banner;