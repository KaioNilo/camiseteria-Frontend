import styles from './Banner.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination } from 'swiper/modules';

const Banner1 = "https://res.cloudinary.com/dqk535bkf/image/upload/v1766873676/Banner_1_ty8hdv.png";
const Banner2 = "https://res.cloudinary.com/dqk535bkf/image/upload/v1766873676/Banner_2_evmvrw.png";
const Banner3 = "https://res.cloudinary.com/dqk535bkf/image/upload/v1766873676/Banner_3_kqsykk.png";

function Banner() {
    const data = [
        { id: '1', image: Banner1 },
        { id: '2', image: Banner2 },
        { id: '3', image: Banner3 },
    ];

    return (
        <section className={styles.banner}>
            <Swiper
                modules={[EffectFade, Autoplay, Pagination]}
                effect="fade"
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
            >
                {data.map((item) => (
                    <SwiperSlide key={item.id}>
                        <img src={item.image} alt="Banner" className={styles.slideImage} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}

export default Banner;