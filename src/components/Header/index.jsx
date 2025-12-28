import styles from './Header.module.css';
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { CgMenu, CgClose } from "react-icons/cg";
import { useState } from "react";

function Header() {
    // Estados menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Alternar estado
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={styles.header}>
            
            <a href="">
                <img className={styles.logo} src="https://res.cloudinary.com/dqk535bkf/image/upload/v1765913112/LogoRoxa_ojdvqr.png" alt="Logo Oliveira Camiseteria" />
            </a>

            <nav className={styles.menu}>
                <a href="#produtos">Produtos</a>
                <a href="#sobreNos">Sobre Nós</a>
                <a href="#frete">Frete</a>
                <a href="https://www.instagram.com/oliveiracamiseteria/" className={styles.social}><FaInstagram /></a>
                <a href="wa.me/message/3HHV5FDTMVOTM1" className={styles.social}><FaWhatsapp /></a>                
            </nav>

            <div className={styles['hamburger-icon']} onClick={toggleMenu}>
                {isMenuOpen ? <CgClose /> : <CgMenu />}
            </div>


            <div className={`${styles['menu-mobile']} ${isMenuOpen ? styles.open : ''}`}>
                <a href="#produtos" onClick={toggleMenu}>Produtos</a>
                <a href="#frete" onClick={toggleMenu}>Frete</a>
                <a href="#sobreNos" onClick={toggleMenu}>Sobre nós</a>
                <a href="#" className={styles.social}><FaInstagram /></a>
                <a href="#" className={styles.social}><FaWhatsapp /></a>
            </div>
        </header>
    );
 }

export default Header;