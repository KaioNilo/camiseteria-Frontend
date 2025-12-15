import React, { useState } from 'react';
import styles from './Simulation.module.css';
import imgFrete from '../../assets/imgFrete.png';

// --- DADOS FIXOS DA EMPRESA E DO PRODUTO ---
// TROQUE ESTE CEP para o seu CEP de ORIGEM final
const CEP_ORIGEM = '01001000'; 

// VALORES AJUSTADOS PARA GARANTIR COMPATIBILIDADE COM REGRAS MÍNIMAS DA API
const DADOS_PRODUTO_UNITARIO = {
    peso: 0.5,       // 500g
    largura: 20,     // cm
    altura: 10,      // cm
    comprimento: 30, // cm
    insurance: 100.00, // Valor unitário de seguro
};

// -----------------------------------------------------

function Simulation() {
    // --- Estados para Armazenar Dados e Opções ---
    const [cep, setCep] = useState('');
    const [quantidade, setQuantidade] = useState(1);
    const [servico, setServico] = useState(''); 
    
    // Resultados e status
    const [endereco, setEndereco] = useState(null); 
    const [valorFrete, setValorFrete] = useState(null);
    const [prazoEntrega, setPrazoEntrega] = useState(null);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false); 

    // --- FUNÇÃO BUSCA ViaCEP ---
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
    
    // --- FUNÇÃO DE CÁLCULO Melhor Envio (Corrigida) ---
    const calcularFreteMelhorEnvio = async (cepDestino, servicoEscolhido, qtd) => {
        
        // 1. CALCULAR DIMENSÕES TOTAIS E VALORES
        const pesoTotal = DADOS_PRODUTO_UNITARIO.peso * qtd;
        const valorSeguroTotal = DADOS_PRODUTO_UNITARIO.insurance * qtd;

        // 2. CRIAR ARRAY DE PACOTES (A API de cotação espera um array de pacotes/caixas)
        // Enviamos um único pacote representando a remessa completa.
        const packagesArray = [{
            // Usamos as dimensões do produto unitário como as dimensões mínimas do pacote.
            height: DADOS_PRODUTO_UNITARIO.altura,
            width: DADOS_PRODUTO_UNITARIO.largura,
            length: DADOS_PRODUTO_UNITARIO.comprimento,
            weight: pesoTotal,
            insurance_value: valorSeguroTotal, // <-- Chave correta para o valor total de seguro
        }];
        
        // 3. CONSTRUIR O BODY DA REQUISIÇÃO
        const bodyParaEnvio = {
            from: { postal_code: CEP_ORIGEM },
            to: { postal_code: cepDestino.replace(/\D/g, '') },
            packages: packagesArray,
            options: {
                receipt: false,
                own_hand: false,
            },
            selected_service: servicoEscolhido.toUpperCase() // Envia o nome (PAC/SEDEX)
        };
        
        // 4. Chamada ao seu servidor intermediário
        const response = await fetch('/api/frete', { 
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
            // Tratamento de erro vindo do Back-end
            throw new Error(data.message || 'Erro desconhecido ao calcular frete. Verifique o console.');
        }
    };

    // --- HANDLER PRINCIPAL (Submissão do Formulário) ---
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
            // Buscar Endereço 
            const dadosEndereco = await buscarEndereco(cep);
            setEndereco(dadosEndereco);
            
            // Calcular Frete
            const resultadoFrete = await calcularFreteMelhorEnvio(dadosEndereco.cep, servico, quantidade);
            setValorFrete(resultadoFrete.valor);
            setPrazoEntrega(resultadoFrete.delivery);

        } catch (error) {
            setErro(error.message);
            setEndereco(null); 
            setValorFrete(null);
            setPrazoEntrega(null);

        } finally {
            setCarregando(false);
        }
    };

    // --- FUNÇÃO PARA WHATSAPP ---
    const handleWhatsApp = () => {
        if (!endereco || !valorFrete || !prazoEntrega) return;

        const nomeServico = servico.toUpperCase();
        const valorFormatado = valorFrete.replace('.', ',');
        const mensagemBase = `Olá! Gostaria de fazer o pedido. Minha simulação de frete deu o seguinte resultado:\n\n` +
                             `*Total de Produtos:* ${quantidade}\n` +
                             `*Serviço:* ${nomeServico}\n` +
                             `*CEP de Destino:* ${cep}\n` +
                             `*Endereço:* ${endereco.logradouro}, ${endereco.bairro} - ${endereco.localidade}/${endereco.uf}\n` +
                             `*Prazo:* ${prazoEntrega}\n` +
                             `*Valor Total do Frete:* R$ ${valorFormatado}\n\n` +
                             `Podemos prosseguir com o pagamento?`;

        // Número de WhatsApp da loja formatado (DDI+DDD+Número, sem caracteres)
        const numeroLoja = '558591651212'; 
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroLoja}&text=${encodeURIComponent(mensagemBase)}`;
        
        window.open(urlWhatsApp, '_blank');
    };

    // --- RENDERIZAÇÃO ---
    return (
        <div className={styles.simulation}>
            
            <div className={styles.imgFrete}>
                {<img src={imgFrete} alt="Imagem de um caminhão Frete" />}
            </div>

            <div className={styles.formFrete}>
                <h1>Simular Frete:</h1>

                {/* FORMULÁRIO COMPLETO */}
                <form onSubmit={handleSubmit} className={styles.formCalculo}>
                    
                    {/* Input CEP */}
                    <div className={styles.cep}>
                        <label htmlFor="cep">CEP:</label>
                        <input
                          type='text'
                          placeholder='Digite seu CEP'
                          value={cep} 
                          onChange={(e) => setCep(e.target.value.replace(/(\D)/g, ''))} // Limpa não dígitos
                          maxLength={8} 
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
                    <div>
                        <label >
                            Forma de envio:
                        </label>

                        <div className={styles.opcoesEnvio}>
                            <label>
                                <input 
                                    type="radio" 
                                    value="pac" 
                                    checked={servico === 'pac'}
                                    onChange={() => setServico('pac')}
                                    required
                                />
                                PAC
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    value="sedex" 
                                    checked={servico === 'sedex'}
                                    onChange={() => setServico('sedex')}
                                    required
                                />
                                SEDEX
                            </label>
                        </div>

                    </div>

                    {/* Botão Pesquisa */}
                    <button type='submit' disabled={carregando || !cep || !servico}>
                        {carregando ? 'Calculando...' : 'Calcular Frete'}
                    </button>
                </form>

                {/* RESULTADO E ERRO */}
                <div className={styles.resultado}>
                    
                    {erro && <p className={styles.erroCep}>**Erro:** {erro}</p>}

                    {endereco && valorFrete && !carregando && (
                        <div className={styles.calculoFrete}>
                            
                            <h3>Resultado do Cálculo:</h3>
                            
                            {/* ENDEREÇO & PRODUTOS */}
                            <p className={styles.endereco}>
                                **{quantidade} produto(s)** via **{servico.toUpperCase()}** para: <br/>
                                {endereco.logradouro}, {endereco.bairro} - {endereco.localidade}/{endereco.uf}
                            </p>
                            
                            {/* PRAZO */}
                            <p className={styles.prazo}>
                                Prazo estimado: **{prazoEntrega}**
                            </p>
                            
                            {/* VALOR FINAL */}
                            <h2>R$ {valorFrete.replace('.', ',')}</h2> 
                            
                            {/* Botão WhatsApp */}
                            <button 
                                type='button' 
                                className={styles.whatsappButton}
                                onClick={handleWhatsApp}
                            >
                                💬 Encaminhar orçamento via WhatsApp
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Simulation;