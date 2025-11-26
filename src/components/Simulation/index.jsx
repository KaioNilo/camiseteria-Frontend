import React, { useState } from 'react';
import styles from './Simulation.module.css';
import imgFrete from '../../assets/imgFrete.png';

const CEP_ORIGEM = '60191335'; 

const DADOS_PRODUTO_UNITARIO = {
    peso: 0.25, 
    largura: 22,
    altura: 3,
    comprimento: 25,
};
// -----------------------------------------------------

function Simulation() {
    // --- Estados para Armazenar Dados e Opções ---
    const [cep, setCep] = useState('');
    const [quantidade, setQuantidade] = useState(1);
    const [servico, setServico] = useState(''); // pac | sedex
    
    // Resultados e status
    const [endereco, setEndereco] = useState(null); 
    const [valorFrete, setValorFrete] = useState(null);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false); 

    // --- FUNÇÃO BUSCA ViaCEP ---
    const buscarEndereco = async (cepParaBuscar) => {
        const cepLimpo = cepParaBuscar.replace(/\D/g, '');
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado ou inválido.');
        }
        return data;
    };
    
    // --- FUNÇÃO DE CÁLCULO ---
    const calcularFreteMelhorEnvio = async (cepDestino, servicoEscolhido, qtd) => {
        
      // CÁLCULO DINÂMICO
        const pesoTotal = qtd * DADOS_PRODUTO_UNITARIO.peso;
        const alturaFinal = qtd * DADOS_PRODUTO_UNITARIO.altura; 
        
        const bodyParaEnvio = {
            from: { postal_code: CEP_ORIGEM },
            to: { postal_code: cepDestino.replace(/\D/g, '') },
            package: {
                height: alturaFinal,     
                width: DADOS_PRODUTO_UNITARIO.largura,
                length: DADOS_PRODUTO_UNITARIO.comprimento,
                weight: pesoTotal,       
            },
            selected_service: servicoEscolhido.toUpperCase() 
        };
        
        // Chamada ao seu servidor intermediário
        const response = await fetch('/api/frete', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyParaEnvio),
        });

        const data = await response.json();

        if (response.ok && data.valor) {
            return data.valor;
        } else {
            throw new Error(data.mensagem || 'Erro ao calcular frete. Serviço indisponível.');
        }
    };

    // --- HANDLER PRINCIPAL (Submissão do Formulário) ---
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        setCarregando(true);
        setEndereco(null);
        setValorFrete(null);
        setErro('');

        if (!servico) {
            setErro('Selecione uma forma de envio (PAC ou SEDEX).');
            setCarregando(false);
            return;
        }

        try {
            // Buscar Endereço 
            const dadosEndereco = await buscarEndereco(cep);
            setEndereco(dadosEndereco);
            
            // Calcular Frete
            const valor = await calcularFreteMelhorEnvio(dadosEndereco.cep, servico, quantidade);
            setValorFrete(valor);

        } catch (error) {
            setErro(error.message);
            setEndereco(null); 
            setValorFrete(null);

        } finally {
            setCarregando(false);
        }
    };

    // --- RENDERIZAÇÃO ---
    return (
        <div className={styles.simulation}>
            
            <div className={styles.imgFrete}>
                {<img src={imgFrete} alt="Imagem de um caminhão Frete" />}
            </div>

            <div className={styles.formFrete}>
                <h1>Simular Frete e Prazo</h1>

                {/* FORMULÁRIO COMPLETO */}
                <form onSubmit={handleSubmit} className={styles.formCalculo}>
                    
                    {/* Input CEP */}
                    <div className='cep'>
                        <label htmlFor="cep">CEP:</label>
                        <input
                          type='text'
                          placeholder='Digite seu CEP'
                          value={cep} 
                          onChange={(e) => setCep(e.target.value)} 
                          maxLength={9} 
                          required
                        />
                    </div>


                    {/* Seleção de Quantidade */}
                    <div className={styles.inputQtd}>
                        <label htmlFor="quantidade">Quantidade de produtos:</label>
                        <input
                            id="quantidade"
                            type='number'
                            min='1'
                            value={quantidade}
                            onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                            required
                        />
                    </div>

                    {/* Forma de Envio */}
                    <div className={styles.opcoesEnvio}>
                        <h3>Selecione a forma de envio:</h3>
                        <label>
                            <input 
                                type="radio" 
                                value="pac" 
                                checked={servico === 'pac'}
                                onChange={() => setServico('pac')}
                                required
                            />
                            **PAC** (Envio Econômico)
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                value="sedex" 
                                checked={servico === 'sedex'}
                                onChange={() => setServico('sedex')}
                                required
                            />
                            **SEDEX** (Envio Expresso)
                        </label>
                    </div>

                    {/* Botão Pesquisa */}
                    <button type='submit' disabled={carregando}>
                        {carregando ? 'Calculando...' : 'Calcular Frete'}
                    </button>
                </form>

                {/* RESULTADO E ERRO */}
                <div className={styles.resultado}>
                    
                    {erro && <p className={styles.erroCep}>**Erro:** {erro}</p>}

                    {endereco && valorFrete && !carregando && (
                        <div className={styles.calculoFrete}>
                            
                            <h3>Resultado do Cálculo:</h3>
                            
                            {/* ENDEREÇO (ViaCEP) */}
                            <p className={styles.endereco}>
                                **{quantidade} produto(s)** enviados via **{servico.toUpperCase()}** para: <br/>
                                {endereco.logradouro}, {endereco.bairro} - {endereco.localidade}/{endereco.uf}
                            </p>
                            
                            {/* VALOR FINAL */}
                            <h2>R$ {valorFrete.replace('.', ',')}</h2> 
                            
                            {/* Botão WhatsApp */}
                            <button className={styles.botaoWpp} type='button'>
                                Encaminhar para whatsapp da loja
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Simulation;