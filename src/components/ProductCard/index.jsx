import React from 'react';
import styles from './ProductCard.module.css';

function ProductCard({ id, name, price, size, image }) {
    
    
    // Cálculo dos Preços
    const numericPrice = price ? parseFloat(price) : 0;

    // PREÇO COM DESCONTO
    const originalPrice = numericPrice / 0.70;

    // PREÇO
    const formattedPrice = price
        ? new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(price)
        : 'R$ --,--';

    // PREÇO ORIGINAL
    const formattedOriginalPrice = originalPrice
        ? new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(originalPrice)
        : 'R$ --,--';

    // --- LÓGICA DE TAMANHOS ---
    const availableSizes = size && Array.isArray(size) ? size : []; 
    
    const imageSrc = image || 'caminho/para/imagem_default.jpg';
    

    return (
        <div className={styles.card}>
            <img 
                src={imageSrc} 
                alt={name || 'Nome do Produto'} 
                className={styles.image} 
            />

            <h5 className={styles.nameProduct}>{name || 'Nome Indisponível'}</h5>

            <div className={styles.info}>

                <div className={styles.price}>
                    <p className={styles.originalPrice}>De <span>{formattedOriginalPrice}</span> por</p>
                    <h3 className={styles.finalPrice}>{formattedPrice}</h3>
                </div>

                <div className={styles.sizes}>
                    <p>Tamanhos</p>
                    
                    <div className={styles.availableSizes}>
                        {availableSizes.length > 0 ? (
                            availableSizes.map((s, index) => (
                                <span 
                                    key={index} 
                                    className={styles.singleSize}
                                >
                                    {s}
                                </span>
                            ))
                        ) : (
                            <span>N/A</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;