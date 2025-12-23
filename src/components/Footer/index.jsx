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
                <a href="#">
                    <FaInstagram />
                </a>
                <a href="#">
                    <FaWhatsapp />
                </a>
            </div>      
        </footer>
    )
}

export default Footer;