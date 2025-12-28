import React, { useState } from 'react';
import axios from 'axios';
import styles from './Simulation.module.css';

const BASE_URL_ENV = import.meta.env.VITE_API_URL || 'https://camiseteria-backend.onrender.com';
const API_BASE_URL = BASE_URL_ENV.replace(/\/$/, '');

const CEP_ORIGEM = '60191335';

const DADOS_PRODUTO_UNITARIO = {
    peso: 0.5,       
    largura: 20,     
    altura: 10,      
    comprimento: 30, 
    insurance: 100.00, 
};

function Simulation() {
    const [cep, setCep] = useState('');
    const [quantidade, setQuantidade] = useState(1);
    const [servico, setServico] = useState(''); 
    
    const [endereco, setEndereco] = useState(null); 
    const [valorFrete, setValorFrete] = useState(null);
    const [prazoEntrega, setPrazoEntrega] = useState(null);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false); 

    const buscarEndereco = async (cepParaBuscar) => {
        const cepLimpo = cepParaBuscar.replace(/\D/g, '');
        if (cepLimpo.length !== 8) return;

        try {
            const res = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            if (res.data.erro) throw new Error('CEP não encontrado.');
            setEndereco(res.data);
            setErro('');
        } catch (err) {
            setEndereco(null);
            setErro('Erro ao procurar endereço.');
        }
    };

    const simularFrete = async (e) => {
        e.preventDefault();
        setCarregando(true);
        setErro('');
        setValorFrete(null);

        try {
            const bodyParaEnvio = {
                from: { postal_code: CEP_ORIGEM },
                to: { postal_code: cep.replace(/\D/g, '') },
                packages: [
                    {
                        weight: DADOS_PRODUTO_UNITARIO.peso * quantidade,
                        width: DADOS_PRODUTO_UNITARIO.largura,
                        height: DADOS_PRODUTO_UNITARIO.altura,
                        length: DADOS_PRODUTO_UNITARIO.comprimento,
                    }
                ],
                selected_service: servico
            };

            const response = await axios.post(`${API_BASE_URL}/api/frete`, bodyParaEnvio);

            if (response.data.valor) {
                setValorFrete(response.data.valor);
                setPrazoEntrega(response.data.delivery);
            }
        } catch (err) {
            console.error("Erro na simulação:", err);
            setErro(err.response?.data?.message || 'Erro ao calcular frete.');
        } finally {
            setCarregando(false);
        }
    };

    const handleWhatsApp = () => {
        const msg = `Olá! Gostaria de encomendar ${quantidade} camiseta(s) para o CEP ${cep}. Valor do frete ${servico.toUpperCase()}: R$ ${valorFrete}`;
        window.open(`https://wa.me/message/3HHV5FDTMVOTM1?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div id="frete" className={styles.simulation}>
            <div className={styles.formFrete}>
                <h2>Simular Frete e Entrega</h2>
                <form onSubmit={simularFrete} className={styles.formulario}>
                    <div className={styles.cep}>
                        <label>Seu CEP:</label>
                        <input 
                            type="text" 
                            value={cep} 
                            onChange={(e) => {
                                const novoValor = e.target.value;
                                setCep(novoValor);
                                if (novoValor.replace(/\D/g, '').length === 8) {
                                    buscarEndereco(novoValor);
                                }
                            }}
                            placeholder="00000-000"
                        />
                    </div>

                    <div className={styles.inputQtd}>
                        <label>Quantidade:</label>
                        <input type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
                    </div>

                    <div className={styles.opcoesEnvio}>
                        <label>
                            <input type="radio" name="servico" value="pac" onChange={() => setServico('pac')} /> PAC
                        </label>
                        <label>
                            <input type="radio" name="servico" value="sedex" onChange={() => setServico('sedex')} /> SEDEX
                        </label>
                    </div>

                    <button type='submit' disabled={carregando || !cep || !servico}>
                        {carregando ? 'Calculando...' : 'Calcular Frete'}
                    </button>
                </form>

                <div className={styles.resultado}>
                    {erro && <p className={styles.erroCep}>{erro}</p>}
                    {valorFrete && !carregando && (
                        <div className={styles.calculoFrete}>
                            <h3>Resultado:</h3>
                            <p>Prazo: {prazoEntrega}</p>
                            <h2>R$ {valorFrete.replace('.', ',')}</h2> 
                            <button onClick={handleWhatsApp} className={styles.whatsappButton}>
                                💬 Pedir via WhatsApp
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Simulation;