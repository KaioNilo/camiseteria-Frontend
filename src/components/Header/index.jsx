import styles from './Header.module.css'
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

function Header() {
    return (
        <header className={styles.header}>
            <nav>
                <a href="#">Produtos</a>
                <a href="#">Frete</a>
                <a href="#">Sobre Nós</a>
            </nav>

            <img className={styles.logo} src="https://res.cloudinary.com/dqk535bkf/image/upload/v1765913112/LogoRoxa_ojdvqr.png" alt="Logo Oliveira Camiseteria" />

            <div className={styles.redes}>
                <span>
                    Fale com a gente →
                </span>

                <div className={styles.icons}>
                    <a href="#">
                        <FaInstagram />
                    </a>
                    <a href="#">
                        <FaWhatsapp />
                    </a>
                </div>
            </div>


        </header>
    )
}

export default Header;
