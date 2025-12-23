import React, { useState } from 'react';
import styles from './Simulation.module.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://camiseteria-backend.onrender.com';

const CEP_ORIGEM = '01001000';

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

    // --- BUSCA ENDEREÇO ---
    const buscarEndereco = async (cepParaBuscar) => {
        const cepLimpo = cepParaBuscar.replace(/\D/g, '');
        if (cepLimpo.length !== 8) {
            throw new Error('O CEP deve conter 8 dígitos.');
        }
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado ou inválido.');
        }
        return data;
    };
    
    // --- CÁLCULO DE FRETE ---
    const calcularFreteMelhorEnvio = async (cepDestino, servicoEscolhido, qtd) => {
        const pesoTotal = DADOS_PRODUTO_UNITARIO.peso * qtd;
        const valorSeguroTotal = DADOS_PRODUTO_UNITARIO.insurance * qtd;

        const packagesArray = [{
            height: DADOS_PRODUTO_UNITARIO.altura,
            width: DADOS_PRODUTO_UNITARIO.largura,
            length: DADOS_PRODUTO_UNITARIO.comprimento,
            weight: pesoTotal,
            insurance_value: valorSeguroTotal,
        }];
        
        const bodyParaEnvio = {
            from: { postal_code: CEP_ORIGEM },
            to: { postal_code: cepDestino.replace(/\D/g, '') },
            packages: packagesArray,
            options: {
                receipt: false,
                own_hand: false,
            },
            selected_service: servicoEscolhido.toUpperCase()
        };
        
        // Chamada URL base dinâmica
        const response = await fetch(`${API_BASE_URL}/api/frete`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyParaEnvio),
        });

        const data = await response.json();

        if (response.ok && data.valor) {
            return {
                valor: data.valor,
                delivery: data.delivery || 'Prazo não informado',
            };
        } else {
            throw new Error(data.message || 'Erro ao calcular frete. O servidor pode estar iniciando.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setCarregando(true);
        setEndereco(null);
        setValorFrete(null);
        setPrazoEntrega(null);
        setErro('');

        if (!servico) {
            setErro('Selecione uma forma de envio (PAC ou SEDEX).');
            setCarregando(false);
            return;
        }

        try {
            const dadosEndereco = await buscarEndereco(cep);
            setEndereco(dadosEndereco);
            
            const resultadoFrete = await calcularFreteMelhorEnvio(dadosEndereco.cep, servico, quantidade);
            setValorFrete(resultadoFrete.valor);
            setPrazoEntrega(resultadoFrete.delivery);

        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    };

    const handleWhatsApp = () => {
        if (!endereco || !valorFrete || !prazoEntrega) return;

        const nomeServico = servico.toUpperCase();
        const valorFormatado = valorFrete.replace('.', ',');
        const mensagemBase = `Olá! Gostaria de fazer o pedido. Minha simulação de frete:\n\n` +
                             `*Total de Produtos:* ${quantidade}\n` +
                             `*Serviço:* ${nomeServico}\n` +
                             `*CEP de Destino:* ${cep}\n` +
                             `*Endereço:* ${endereco.logradouro}, ${endereco.bairro} - ${endereco.localidade}/${endereco.uf}\n` +
                             `*Prazo:* ${prazoEntrega}\n` +
                             `*Valor Total do Frete:* R$ ${valorFormatado}`;

        const numeroLoja = '558591651212'; 
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroLoja}&text=${encodeURIComponent(mensagemBase)}`;
        window.open(urlWhatsApp, '_blank');
    };

    return (
        <div id='frete' className={styles.simulation}>
            <div className={styles.formFrete}>
                <h1>Simular Frete:</h1>
                <form onSubmit={handleSubmit} className={styles.formCalculo}>
                    <div className={styles.cep}>
                        <label>CEP:</label>
                        <input
                          type='text'
                          placeholder='00000000'
                          value={cep} 
                          onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))} 
                          maxLength={8} 
                          required
                        />
                    </div>

                    <div className={styles.inputQtd}>
                        <label>Quantidade:</label>
                        <input
                            type='number'
                            min='1'
                            value={quantidade}
                            onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                            required
                        />
                    </div>

                    <div className={styles.opcoesEnvio}>
                        <label>
                            <input type="radio" value="pac" checked={servico === 'pac'} onChange={() => setServico('pac')} /> PAC
                        </label>
                        <label>
                            <input type="radio" value="sedex" checked={servico === 'sedex'} onChange={() => setServico('sedex')} /> SEDEX
                        </label>
                    </div>

                    <button type='submit' disabled={carregando || !cep || !servico}>
                        {carregando ? 'Calculando...' : 'Calcular Frete'}
                    </button>
                </form>

                <div className={styles.resultado}>
                    {erro && <p className={styles.erroCep}>**Erro:** {erro}</p>}
                    {endereco && valorFrete && !carregando && (
                        <div className={styles.calculoFrete}>
                            <h3>Resultado:</h3>
                            <p>{quantidade} produto(s) via {servico.toUpperCase()} para {endereco.localidade}/{endereco.uf}</p>
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