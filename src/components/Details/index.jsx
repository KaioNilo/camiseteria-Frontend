import styles from './Details.module.css'

function Details() {
    return (
        <div className={styles.details}>
            <h1>Detalhes</h1>
            
            <div className={styles.imageDetails}>
                <img className={styles.imgDetail} src="https://res.cloudinary.com/dqk535bkf/image/upload/v1766179759/Modelo_Blusa_jhvtmg.png" alt="Modelo Blusa" />

                <img className={styles.imgDetail} src="https://res.cloudinary.com/dqk535bkf/image/upload/v1766151981/TABELA_huebq6.png" alt="Tabela de Tamanhos" />
            </div>


            <ul className={styles.text}>
                <li>Material sustentável: camiseta feita com 100% de fibra natural de algodão sustentável.</li>
                <li>Camiseta com modelagem regular: não temos diferenciação entre camisetas masculinas e camisetas femininas, todas nossas peças contam com uma modelagem regular, perfeita para todos os corpos.</li>
                <li>Você ainda pode optar pela nossa camiseta baby look, uma opção para quem deseja uma peça com comprimento menor, mangas mais curtas e gola mais aberta.</li>
                <li>Camiseta estampada por processo de serigrafia: nossas camisetas personalizadas são desenvolvidas por um time de artistas responsáveis por criar as estampas mais criativas.</li>
            </ul>
            
        </div>
    );
}

export default Details;