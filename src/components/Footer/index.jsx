import styles from './Footer.module.css'
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

function Footer() {
    return (
        <footer className={styles.footer}>

            <img className={styles.logoFooter} src="https://res.cloudinary.com/dqk535bkf/image/upload/v1765913112/LogoBranca_hfdbiq.png" alt="" />

            <span>
                    ® Oliverira Camiseteria
            </span>

            <div className={styles.icons}>
                <a href="https://www.instagram.com/oliveiracamiseteria/">
                    <FaInstagram />
                </a>
                <a href="https://wa.me/message/3HHV5FDTMVOTM1">
                    <FaWhatsapp />
                </a>
            </div>      
        </footer>
    )
}

export default Footer;