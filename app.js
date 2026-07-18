let senhaDono = localStorage.getItem("senha_dono") || "1234";
let senhaAtendente = localStorage.getItem("senha_atendente") || "5678"; // Código padrão inicial

// Dados Persistentes com LocalStorage
let produtos = JSON.parse(localStorage.getItem("produtos_mercearia")) || [
    { id: 1, nome: "Arroz TopFlour 5kg", tipo: "UNI", categoria: "Básicos", custo: 320, preco: 400, qtd: 15, imagem: "", qtdAtacado: 5, descAtacado: 10 },
    { id: 2, nome: "Peixe Xaputa (KG)", tipo: "KG", categoria: "Frescos", custo: 180, preco: 250, qtd: 20, imagem: "", qtdAtacado: 0, descAtacado: 0 },
    { id: 3, nome: "Açúcar Castanho (KG)", tipo: "KG", categoria: "Básicos", custo: 50, preco: 75, qtd: 50, imagem: "", qtdAtacado: 10, descAtacado: 5 }
];

let contasClientes = JSON.parse(localStorage.getItem("contas_clientes")) || {};
let clienteLogadoTel = localStorage.getItem("cliente_logado_tel") || null;

let sugestoesProdutos = JSON.parse(localStorage.getItem("sugestoes_produtos")) || [];
let feedbacksClientes = JSON.parse(localStorage.getItem("feedbacks_clientes")) || [];

let carrinhoBalcao = [];
let carrinhoCliente = [];
let pedidos = JSON.parse(localStorage.getItem("pedidos_mercearia")) || [];
let dividas = JSON.parse(localStorage.getItem("dividas_mercearia")) || [];
let despesas = JSON.parse(localStorage.getItem("despesas_mercearia")) || [];
let historicoVendas = JSON.parse(localStorage.getItem("historico_mercearia")) || [];
let mesesArquivados = JSON.parse(localStorage.getItem("meses_arquivados_mercearia")) || [];

// Variáveis de Operação de Produtos Avulsos e Transações
let produtosAvulsosEstoque = JSON.parse(localStorage.getItem("produtos_avulsos_estoque")) || {}; 
let transacoesCarteira = JSON.parse(localStorage.getItem("transacoes_carteira")) || [];

let categoriaSelecionadaCliente = "Todos";
let categoriaSelecionadaBalcao = "Todos";

// ==========================================
// CONTROLADOR DE VISÃO ÚNICA (SISTEMA DE ACESSO)
// ==========================================
function verificarPerfilAcesso() {
    const perfilAtual = localStorage.getItem("perfil_sistema") || "cliente";
    
    const btnCaixa = document.getElementById("nav-btn-caixa");
    const btnEncomendas = document.getElementById("nav-btn-encomendas");
    const btnDespesas = document.getElementById("nav-btn-despesas");
    const btnDono = document.getElementById("nav-btn-dono");
    const btnSairModo = document.getElementById("nav-btn-sair-modo");

    if (perfilAtual === "dono") {
        if(btnCaixa) btnCaixa.style.display = "inline-block";
        if(btnEncomendas) btnEncomendas.style.display = "inline-block";
        if(btnDespesas) btnDespesas.style.display = "inline-block";
        if(btnDono) btnDono.style.display = "inline-block";
        if(btnSairModo) btnSairModo.style.display = "inline-block";
        mudarAbaDirecto('dono');
        carregarTabelaStock();
        carregarTabelaDividas();
        carregarTabelaDespesas();
        carregarFinancas();
        carregarHistoricoArquivado();
        carregarSugestoesDono();
        carregarFeedbacksDono();
        carregarAvulsoStatusGeral();
        carregarTabelaCarteiras();
        carregarRelatorioProdutosVendidosHoje();
    } else if (perfilAtual === "atendente") {
        if(btnCaixa) btnCaixa.style.display = "inline-block";
        if(btnEncomendas) btnEncomendas.style.display = "inline-block";
        if(btnDespesas) btnDespesas.style.display = "none";
        if(btnDono) btnDono.style.display = "none";
        if(btnSairModo) btnSairModo.style.display = "inline-block";
        mudarAbaDirecto('vendas');
    } else {
        if(btnCaixa) btnCaixa.style.display = "none";
        if(btnEncomendas) btnEncomendas.style.display = "none";
        if(btnDespesas) btnDespesas.style.display = "none";
        if(btnDono) btnDono.style.display = "none";
        if(btnSairModo) btnSairModo.style.display = "none";
        mudarAbaDirecto('cliente');
    }
}

function iniciarLoginModoAdministrativo() {
    const codigo = prompt("Introduza o Código de Acesso (Dono ou Atendente):");
    if (!codigo) return;

    if (codigo === senhaDono) {
        localStorage.setItem("perfil_sistema", "dono");
        alert("Acesso concedido como PROPRIETÁRIO!");
        verificarPerfilAcesso();
    } else if (codigo === senhaAtendente) {
        localStorage.setItem("perfil_sistema", "atendente");
        alert("Acesso concedido como ATENDENTE!");
        verificarPerfilAcesso();
    } else {
        alert("Código de acesso incorreto!");
    }
}

function sairModoAdministrativo() {
    if (confirm("Deseja sair do modo de gestão e voltar para a Loja do Cliente?")) {
        localStorage.setItem("perfil_sistema", "cliente");
        verificarPerfilAcesso();
    }
}

function solicitarAcessoDono() {
    mudarAbaDirecto('dono');
    carregarTabelaStock();
    carregarTabelaDividas();
    carregarTabelaDespesas();
    carregarFinancas();
    carregarHistoricoArquivado();
    carregarSugestoesDono();
    carregarFeedbacksDono();
    carregarAvulsoStatusGeral();
    carregarTabelaCarteiras();
    carregarRelatorioProdutosVendidosHoje();
}

function solicitarAcessoDonoAba(nomeAba) {
    mudarAbaDirecto(nomeAba);
    if (nomeAba === 'despesas') carregarTabelaDespesas();
}

function salvarDados() {
    localStorage.setItem("produtos_mercearia", JSON.stringify(produtos));
    localStorage.setItem("contas_clientes", JSON.stringify(contasClientes));
    localStorage.setItem("pedidos_mercearia", JSON.stringify(pedidos));
    localStorage.setItem("dividas_mercearia", JSON.stringify(dividas));
    localStorage.setItem("despesas_mercearia", JSON.stringify(despesas));
    localStorage.setItem("historico_mercearia", JSON.stringify(historicoVendas));
    localStorage.setItem("meses_arquivados_mercearia", JSON.stringify(mesesArquivados));
    localStorage.setItem("sugestoes_produtos", JSON.stringify(sugestoesProdutos));
    localStorage.setItem("feedbacks_clientes", JSON.stringify(feedbacksClientes));
    localStorage.setItem("senha_dono", senhaDono);
    localStorage.setItem("senha_atendente", senhaAtendente);
    localStorage.setItem("produtos_avulsos_estoque", JSON.stringify(produtosAvulsosEstoque));
    localStorage.setItem("transacoes_carteira", JSON.stringify(transacoesCarteira));
    atualizarBadges();
}

function atualizarBadges() {
    const pendentes = pedidos.filter(p => p.status === 'Pendente' || p.status === 'Pronto para Levantamento').length;
    const badge = document.getElementById("badge-pedidos");
    if (badge) badge.innerText = pendentes;
}

// 1. SISTEMA DE CLIENTE (LOGIN / REGISTO COMPLETO)
function registarCliente() {
    const nome = document.getElementById("cli-reg-nome").value.trim();
    const apelido = document.getElementById("cli-reg-apelido").value.trim();
    const tel = document.getElementById("cli-reg-tel").value.trim();
    const pass = document.getElementById("cli-reg-pass").value.trim();

    if (!nome || !apelido || !tel || !pass) {
        return alert("Por favor, preencha todos os campos para registar.");
    }
    if (contasClientes[tel]) {
        return alert("Este número de telemóvel já está registado!");
    }

    contasClientes[tel] = {
        nome: `${nome} ${apelido}`,
        pass: pass,
        pontos: 0
    };
    
    salvarDados();
    alert("Conta criada com sucesso! Boas compras!");
    
    document.getElementById("cli-reg-nome").value = "";
    document.getElementById("cli-reg-apelido").value = "";
    document.getElementById("cli-reg-tel").value = "";
    document.getElementById("cli-reg-pass").value = "";

    entrarSessaoCliente(tel);
}

function fazerLoginCliente() {
    const tel = document.getElementById("cli-login-tel").value.trim();
    const pass = document.getElementById("cli-login-pass").value.trim();

    if (!tel || !pass) return alert("Insira o telemóvel e a palavra-passe.");

    if (contasClientes[tel] && contasClientes[tel].pass === pass) {
        entrarSessaoCliente(tel);
        document.getElementById("cli-login-tel").value = "";
        document.getElementById("cli-login-pass").value = "";
    } else {
        alert("Telemóvel ou palavra-passe incorretos!");
    }
}

function entrarSessaoCliente(tel) {
    clienteLogadoTel = tel;
    localStorage.setItem("cliente_logado_tel", tel);
    
    document.getElementById("box-auth-cliente").style.display = "none";
    document.getElementById("box-perfil-cliente").style.display = "flex";
    document.getElementById("box-interatividade-cliente").style.display = "block";
    
    document.getElementById("cli-nome-logado").innerText = contasClientes[tel].nome;
    
    atualizarBarraProgressoFidelidade();
    carregarLojaCliente();
    carregarMinhasEncomendas();
}

function fazerLogoutCliente() {
    clienteLogadoTel = null;
    localStorage.removeItem("cliente_logado_tel");
    document.getElementById("box-auth-cliente").style.display = "flex";
    document.getElementById("box-perfil-cliente").style.display = "none";
    document.getElementById("box-interatividade-cliente").style.display = "none";
    carregarLojaCliente();
    carregarMinhasEncomendas();
}

function atualizarBarraProgressoFidelidade() {
    if (!clienteLogadoTel) return;
    const pts = contasClientes[clienteLogadoTel].pontos || 0;
    document.getElementById("cli-pontos-logado").innerText = `${pts} Pts`;

    const barFill = document.getElementById("progress-bar-fill");
    const txtProgresso = document.getElementById("txt-progresso-fidelidade");

    if (pts >= 100) {
        barFill.style.width = "100%";
        txtProgresso.innerText = "Parabéns! É um Cliente Prata e ganhou 5% de desconto em todas as encomendas!";
    } else {
        const percentagem = (pts / 100) * 100;
        barFill.style.width = `${percentagem}%`;
        txtProgresso.innerText = `Faltam ${100 - pts} pts para atingir a categoria Prata e ganhar 5% de desconto!`;
    }
}

// 2. LOJA ONLINE
function carregarLojaCliente(lista = produtos) {
    const grid = document.getElementById("grid-cliente");
    if (!grid) return;
    grid.innerHTML = "";

    let produtosFiltrados = lista;
    if (categoriaSelecionadaCliente !== "Todos") {
        produtosFiltrados = lista.filter(p => p.categoria === categoriaSelecionadaCliente);
    }

    if (produtosFiltrados.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b;">Nenhum produto encontrado.</p>`;
        return;
    }

    produtosFiltrados.forEach(p => {
        const esgotado = p.qtd <= 0;
        let atacadoTag = "";
        if (p.qtdAtacado > 0 && p.descAtacado > 0) {
            atacadoTag = `<span class="tag-atacado">Leve ${p.qtdAtacado}+ e ganhe ${p.descAtacado}% desc.</span>`;
        }

        let imgHtml = `<div class="card-img-placeholder"><i class="fa-solid fa-image"></i></div>`;
        if (p.imagem && p.imagem.trim() !== "") {
            imgHtml = `<img src="${p.imagem}" class="card-img" alt="${p.nome}">`;
        }

        grid.innerHTML += `
            <div class="card-produto ${esgotado ? 'esgotado' : ''} card-fade">
                <span class="tag-kg">${p.tipo}</span>
                ${esgotado ? '<span class="tag-esgotado">ESGOTADO</span>' : ''}
                ${imgHtml}
                <span class="nome">${p.nome}</span>
                <span class="preco">${p.preco.toFixed(2)} MT</span>
                ${atacadoTag}
                <button onclick="adicionarAoCarrinhoCliente(${p.id})" ${esgotado ? 'disabled' : ''} class="btn-cadastrar" style="margin-top:auto; width: 100%;"><i class="fa-solid fa-cart-plus"></i> Adicionar</button>
            </div>
        `;
    });

    renderizarTagsCategoria("cliente");
}

function renderizarTagsCategoria(origem) {
    const box = document.getElementById(origem === "cliente" ? "categoria-tags-cliente" : "categoria-tags-balcao");
    if (!box) return;

    const cats = ["Todos", "Básicos", "Frescos", "Bebidas", "Snacks", "Limpeza"];
    box.innerHTML = "";
    
    cats.forEach(c => {
        const sel = (origem === "cliente" ? categoriaSelecionadaCliente : categoriaSelecionadaBalcao) === c;
        box.innerHTML += `<span class="tag-categoria ${sel ? 'active' : ''}" onclick="selecionarCategoria('${origem}', '${c}')">${c}</span>`;
    });
}

function selecionarCategoria(origem, cat) {
    if (origem === "cliente") {
        categoriaSelecionadaCliente = cat;
        carregarLojaCliente();
    } else {
        categoriaSelecionadaBalcao = cat;
        carregarProdutosBalcao();
    }
}

function adicionarAoCarrinhoCliente(id) {
    if (!clienteLogadoTel) return alert("Por favor, faça Login na sua conta primeiro para poder encomendar!");

    const p = produtos.find(item => item.id === id);
    let qtdPedida = 1;
    let precoFixoItem = null;

    const opcao = prompt(`Escolha como quer pedir [${p.nome}]:\n\n1 - Por VALOR em Meticais (Ex: Quero 100 MT)\n2 - Por QUANTIDADE / PESO / VOLUME (Ex: 1, 2 ou 0.5)`);

    if (opcao === "1") {
        const valorMT = parseFloat(prompt(`Digite o valor em METICAIS (MT) que quer comprar de ${p.nome}:`));
        if (isNaN(valorMT) || valorMT <= 0) return alert("Valor inválido!");
        
        qtdPedida = parseFloat((valorMT / p.preco).toFixed(3));
        precoFixoItem = valorMT;
    } else if (opcao === "2") {
        const qtdStr = prompt(`Digite a quantidade ou peso em ${p.tipo} para [${p.nome}]:`);
        qtdPedida = parseFloat(qtdStr);
        if (isNaN(qtdPedida) || qtdPedida <= 0) return alert("Quantidade inválida!");
    } else {
        return;
    }

    if (p.qtd < qtdPedida) return alert(`Stock insuficiente! Disponível apenas: ${p.qtd} ${p.tipo}`);

    carrinhoCliente.push({ ...p, qtd: qtdPedida, precoFixo: precoFixoItem });
    atualizarCarrinhoCliente();
}

function calcularPrecoFinalItem(item) {
    if (item.precoFixo !== null && item.precoFixo !== undefined) {
        return item.precoFixo;
    }
    let precoUnidade = item.preco;
    if (item.qtdAtacado > 0 && item.descAtacado > 0 && item.qtd >= item.qtdAtacado) {
        const desconto = (item.preco * item.descAtacado) / 100;
        precoUnidade = item.preco - desconto;
    }
    return precoUnidade * item.qtd;
}

function atualizarCarrinhoCliente() {
    const box = document.getElementById("carrinho-cli-itens");
    const totalEl = document.getElementById("total-cli");
    if (!box) return;
    box.innerHTML = "";
    let total = 0;

    carrinhoCliente.forEach(item => {
        const sub = calcularPrecoFinalItem(item);
        total += sub;
        
        let infoDesconto = "";
        if (item.qtdAtacado > 0 && item.qtd >= item.qtdAtacado) {
            infoDesconto = ` <small style="color:#d97706;">(Desc. Atacado Aplicado)</small>`;
        }

        box.innerHTML += `
            <div style="font-size:0.85rem; margin-bottom:5px; padding-bottom:5px; border-bottom: 1px solid #f1f5f9;">
                ${item.nome} (${item.qtd} ${item.tipo})${infoDesconto}<br>
                <strong>${sub.toFixed(2)} MT</strong>
            </div>
        `;
    });

    if (clienteLogadoTel && contasClientes[clienteLogadoTel].pontos >= 100) {
        const descFidelidade = total * 0.05;
        total -= descFidelidade;
        box.innerHTML += `
            <div style="color: #22c55e; font-size: 0.8rem; font-weight: bold; margin-top: 8px;">
                🎁 Desconto de Cliente Prata (5%): -${descFidelidade.toFixed(2)} MT
            </div>
        `;
    }

    totalEl.innerText = `${total.toFixed(2)} MT`;
}

function enviarPedidoOnline() {
    if (!clienteLogadoTel) return alert("Faça login para submeter a encomenda.");
    if (carrinhoCliente.length === 0) return alert("Carrinho vazio!");

    const idPedido = Date.now();
    let total = carrinhoCliente.reduce((acc, i) => acc + calcularPrecoFinalItem(i), 0);

    if (contasClientes[clienteLogadoTel].pontos >= 100) {
        total = total * 0.95;
    }

    pedidos.push({
        id: idPedido,
        tel: clienteLogadoTel,
        cliente: contasClientes[clienteLogadoTel].nome,
        itens: [...carrinhoCliente],
        total: total,
        status: "Pendente",
        dataVenda: new Date().toISOString().split("T")[0]
    });

    salvarDados();
    alert(`Encomenda enviada com sucesso! Nº do Pedido: #${idPedido}`);
    carrinhoCliente = [];
    atualizarCarrinhoCliente();
    carregarMinhasEncomendas();
}

function carregarMinhasEncomendas() {
    const box = document.getElementById("lista-minhas-encomendas");
    if (!box) return;
    box.innerHTML = "";

    if (!clienteLogadoTel) {
        box.innerHTML = "<p style='color:#64748b;'>Faça login para ver as suas encomendas.</p>";
        return;
    }

    const minhas = pedidos.filter(p => p.tel === clienteLogadoTel);
    if (minhas.length === 0) {
        box.innerHTML = "<p style='color:#64748b;'>Nenhuma encomenda realizada ainda.</p>";
        return;
    }

    minhas.forEach(p => {
        let cor = "#f59e0b";
        if (p.status === "Pronto para Levantamento") cor = "#3b82f6";
        if (p.status === "Entregue e Pago") cor = "#22c55e";

        box.innerHTML += `
            <div style="border: 1px solid #cbd5e1; padding: 10px; border-radius: 8px; margin-bottom: 8px;" class="card-fade">
                <strong>Pedido #${p.id}</strong> - Total: ${p.total.toFixed(2)} MT<br>
                Estado: <span style="color:${cor}; font-weight:bold;">${p.status}</span>
            </div>
        `;
    });
}

// 3. INTERATIVIDADE E ENGAJAMENTO
function enviarSugestaoProduto() {
    const input = document.getElementById("cli-sugestao-prod");
    const valor = input.value.trim();
    if (!valor) return alert("Escreva um nome de produto para sugerir.");

    sugestoesProdutos.push({
        id: Date.now(),
        cliente: contasClientes[clienteLogadoTel].nome,
        tel: clienteLogadoTel,
        produto: valor
    });

    salvarDados();
    input.value = "";
    alert("Obrigado pela sugestão! Faremos de tudo para trazer este produto para a loja!");
    carregarSugestoesDono();
}

function enviarFeedback() {
    const input = document.getElementById("cli-feedback-msg");
    const valor = input.value.trim();
    if (!valor) return alert("Escreva o seu comentário.");

    feedbacksClientes.push({
        id: Date.now(),
        cliente: contasClientes[clienteLogadoTel].nome,
        mensagem: valor
    });

    salvarDados();
    input.value = "";
    alert("Contribuição enviada com sucesso! A sua opinião melhora a nossa mercearia.");
    carregarFeedbacksDono();
}

function carregarSugestoesDono() {
    const container = document.getElementById("lista-sugestoes-dono");
    if (!container) return;
    container.innerHTML = "";

    if (sugestoesProdutos.length === 0) {
        container.innerHTML = "<p style='color:#94a3b8;'>Nenhuma sugestão enviada.</p>";
        return;
    }

    sugestoesProdutos.forEach(s => {
        container.innerHTML += `
            <div style="padding: 5px; border-bottom: 1px solid #f1f5f9;">
                👤 <strong>${s.cliente}</strong> (${s.tel}): <span style="color:#2563eb;">${s.produto}</span>
            </div>
        `;
    });
}

function carregarFeedbacksDono() {
    const container = document.getElementById("lista-feedbacks-dono");
    if (!container) return;
    container.innerHTML = "";

    if (feedbacksClientes.length === 0) {
        container.innerHTML = "<p style='color:#94a3b8;'>Nenhum feedback recebido.</p>";
        return;
    }

    feedbacksClientes.forEach(f => {
        container.innerHTML += `
            <div style="padding: 5px; border-bottom: 1px solid #f1f5f9;">
                <strong>${f.cliente}:</strong> <span style="font-style: italic;">"${f.mensagem}"</span>
            </div>
        `;
    });
}

// 4. VENDA NO BALCÃO (POS CORRIGIDO)
function carregarProdutosBalcao(lista = produtos) {
    const grid = document.getElementById("grid-produtos");
    if (!grid) return;
    grid.innerHTML = "";

    let produtosFiltrados = lista;
    if (categoriaSelecionadaBalcao !== "Todos") {
        produtosFiltrados = lista.filter(p => p.categoria === categoriaSelecionadaBalcao);
    }

    produtosFiltrados.forEach(p => {
        let imgHtml = `<div class="card-img-placeholder"><i class="fa-solid fa-image"></i></div>`;
        if (p.imagem && p.imagem.trim() !== "") {
            imgHtml = `<img src="${p.imagem}" class="card-img" alt="${p.nome}">`;
        }

        const isEsgotado = p.qtd <= 0;

        grid.innerHTML += `
            <div class="card-produto ${isEsgotado ? 'esgotado' : ''}" onclick="adicionarAoCarrinhoBalcao(${p.id})">
                <span class="tag-kg">${p.tipo}</span>
                ${imgHtml}
                <span class="nome">${p.nome}</span>
                <span class="preco">${p.preco.toFixed(2)} MT</span>
                <small style="color:#2563eb; font-weight:bold;">Stock: ${p.qtd} ${p.tipo}</small>
                <button class="btn-cadastrar" style="margin-top:8px; width:100%; pointer-events:none;" ${isEsgotado ? 'disabled' : ''}><i class="fa-solid fa-cart-plus"></i> Vender</button>
            </div>
        `;
    });

    renderizarTagsCategoria("balcao");
}

function adicionarAoCarrinhoBalcao(id) {
    const p = produtos.find(item => item.id === id);
    if(p.qtd <= 0) return alert("Produto esgotado!");
    
    let qtdComprada = 1;
    let precoFixoItem = null;

    const opcao = prompt(`[${p.nome}]\nComo deseja realizar esta venda?\n\n1 - Por VALOR EM METICAIS\n2 - Por QUANTIDADE / PESO / VOLUME`);

    if (opcao === "1") {
        const valorDinheiro = parseFloat(prompt(`Digite o VALOR EM METICAIS:`));
        if (isNaN(valorDinheiro) || valorDinheiro <= 0) return alert("Valor inválido!");

        qtdComprada = parseFloat((valorDinheiro / p.preco).toFixed(3));
        precoFixoItem = valorDinheiro;
    } else if (opcao === "2") {
        const inputQtd = prompt(`Digite a Quantidade ou Peso em ${p.tipo} para [${p.nome}]:`, "1");
        qtdComprada = parseFloat(inputQtd);
        if (isNaN(qtdComprada) || qtdComprada <= 0) return alert("Quantidade inválida!");
    } else {
        return;
    }

    if (p.qtd < qtdComprada) return alert(`Stock insuficiente! Disponível: ${p.qtd}`);

    carrinhoBalcao.push({ ...p, qtd: qtdComprada, precoFixo: precoFixoItem });
    atualizarCarrinhoBalcao();
}

function atualizarCarrinhoBalcao() {
    const lista = document.getElementById("lista-carrinho");
    const totalEl = document.getElementById("total-val");
    if (!lista) return;
    lista.innerHTML = "";
    let total = 0;

    carrinhoBalcao.forEach((item, index) => {
        const sub = calcularPrecoFinalItem(item);
        total += sub;

        lista.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">
                <div>
                    <strong>${item.nome}</strong><br>
                    <small>${item.qtd} ${item.tipo} x ${item.preco.toFixed(2)} MT</small>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <strong>${sub.toFixed(2)} MT</strong>
                    <button onclick="removerItemBalcao(event, ${index})" style="background:#ef4444; color:white; border:none; border-radius:4px; padding:2px 6px; cursor:pointer;">X</button>
                </div>
            </div>
        `;
    });

    let totalArredondado = total;
    const centavos = total % 1;
    if (centavos > 0) {
        totalArredondado = Math.floor(total); 
    }

    totalEl.innerHTML = `${totalArredondado.toFixed(2)} MT ${centavos > 0 ? `<br><small style="color:#d97706; font-size:0.75rem;">Arredondado de ${total.toFixed(2)} MT</small>` : ''}`;
    totalEl.dataset.totalReal = total;
    totalEl.dataset.totalArredondado = totalArredondado;

    calcularTroco();
}

function removerItemBalcao(event, index) {
    if(event) event.stopPropagation();
    carrinhoBalcao.splice(index, 1);
    atualizarCarrinhoBalcao();
}

function calcularTroco() {
    const totalEl = document.getElementById("total-val");
    if (!totalEl) return;
    const total = parseFloat(totalEl.dataset.totalArredondado) || 0;
    const pago = parseFloat(document.getElementById("valor-pago").value) || 0;
    const troco = pago - total;
    document.getElementById("troco-val").innerText = (troco >= 0 && total > 0) ? `${troco.toFixed(2)} MT` : "0,00 MT";
}

function finalizarVendaBalcao() {
    if (carrinhoBalcao.length === 0) return alert("Carrinho vazio!");

    const metodo = document.getElementById("metodo-pagamento").value;
    const tel = document.getElementById("venda-cliente-tel").value.trim();
    
    const totalEl = document.getElementById("total-val");
    const totalCobrado = parseFloat(totalEl.dataset.totalArredondado);
    const totalReal = parseFloat(totalEl.dataset.totalReal);

    const lucro = carrinhoBalcao.reduce((acc, i) => {
        const subVenda = calcularPrecoFinalItem(i);
        const subCusto = i.custo * i.qtd;
        return acc + (subVenda - subCusto);
    }, 0);

    carrinhoBalcao.forEach(item => {
        const prod = produtos.find(p => p.id === item.id);
        if (prod) prod.qtd = parseFloat((prod.qtd - item.qtd).toFixed(3));
    });

    if (tel && contasClientes[tel]) {
        contasClientes[tel].pontos = (contasClientes[tel].pontos || 0) + Math.floor(totalCobrado / 100);
    }

    historicoVendas.push({
        data: new Date().toLocaleTimeString(),
        dataVenda: new Date().toISOString().split("T")[0],
        metodo: metodo,
        total: totalCobrado,
        lucro: lucro - (totalReal - totalCobrado),
        itens: carrinhoBalcao.map(i => `${i.nome} (${i.qtd} ${i.tipo})`).join(", "),
        detalhesItens: carrinhoBalcao.map(i => ({ nome: i.nome, qtd: i.qtd, tipo: i.tipo }))
    });

    salvarDados();
    carregarFinancas();
    alert("Venda concluída e stock abatido com sucesso!");
    carrinhoBalcao = [];
    document.getElementById("valor-pago").value = "";
    document.getElementById("venda-cliente-tel").value = "";
    atualizarCarrinhoBalcao();
    carregarProdutosBalcao();
    carregarRelatorioProdutosVendidosHoje();
}

// 5. GESTÃO DE ENCOMENDAS ONLINE
function carregarPedidosPendentes() {
    const container = document.getElementById("lista-pedidos-pendentes");
    if (!container) return;
    container.innerHTML = "";

    const pedidosAtivos = pedidos.filter(p => p.status !== "Entregue e Pago");

    if (pedidosAtivos.length === 0) {
        container.innerHTML = "<p>Nenhuma encomenda pendente.</p>";
        return;
    }

    pedidosAtivos.forEach(p => {
        const pronto = p.status === "Pronto para Levantamento";
        const itensTxt = p.itens.map(i => `${i.nome} (${i.qtd} ${i.tipo})`).join(", ");
        container.innerHTML += `
            <div class="card-pedido-pendente card-fade" style="border:1px solid #cbd5e1; padding:15px; border-radius:12px; margin-bottom:10px; background:white;">
                <h4>Pedido #${p.id} - ${p.cliente}</h4>
                <p><strong>Tel:</strong> ${p.tel}</p>
                <p><strong>Itens:</strong> ${itensTxt}</p>
                <p><strong>Total:</strong> ${p.total.toFixed(2)} MT</p>
                <p><strong>Estado:</strong> <span style="font-weight:bold; color:${pronto ? '#3b82f6' : '#f59e0b'}">${p.status}</span></p>
                
                ${!pronto ? `<button onclick="marcarPedidoPronto(${p.id})" class="btn-cadastrar" style="margin-top:10px; background:#3b82f6;"><i class="fa-solid fa-box-open"></i> Marcar como Pronto</button>` : ''}
                ${pronto ? `<button onclick="finalizarPagamentoPedido(${p.id})" class="btn-cadastrar" style="margin-top:10px; background:#16a34a;"><i class="fa-solid fa-check-double"></i> Pago e Entregue</button>` : ''}
            </div>
        `;
    });
}

function marcarPedidoPronto(id) {
    const ped = pedidos.find(p => p.id === id);
    if (ped) {
        ped.status = "Pronto para Levantamento";
        ped.itens.forEach(item => {
            const prod = produtos.find(pr => pr.id === item.id);
            if (prod) prod.qtd = parseFloat((prod.qtd - item.qtd).toFixed(3));
        });

        salvarDados();
        carregarPedidosPendentes();
        alert("Pedido pronto! Stock abatido. Cliente notificado no site.");
    }
}

function finalizarPagamentoPedido(id) {
    const ped = pedidos.find(p => p.id === id);
    if (!ped) return;

    if (confirm(`Confirmar recebimento de ${ped.total.toFixed(2)} MT do pedido #${ped.id}?`)) {
        ped.status = "Entregue e Pago";

        const lucroPedido = ped.itens.reduce((acc, i) => {
            const subVenda = calcularPrecoFinalItem(i);
            const subCusto = i.custo * i.qtd;
            return acc + (subVenda - subCusto);
        }, 0);

        historicoVendas.push({
            data: new Date().toLocaleTimeString(),
            dataVenda: new Date().toISOString().split("T")[0],
            metodo: "Encomenda Online",
            total: ped.total,
            lucro: lucroPedido,
            itens: `Encomenda #${ped.id} - Cliente: ${ped.cliente}`,
            detalhesItens: ped.itens.map(i => ({ nome: i.nome, qtd: i.qtd, tipo: i.tipo }))
        });

        if (contasClientes[ped.tel]) {
            contasClientes[ped.tel].pontos = (contasClientes[ped.tel].pontos || 0) + Math.floor(ped.total / 100);
        }

        salvarDados();
        carregarPedidosPendentes();
        carregarFinancas();
        alert("Pagamento confirmado e adicionado à faturação!");
        carregarRelatorioProdutosVendidosHoje();
    }
}

// 6. DÍVIDAS, DESPESAS E FECHO MENSAL
function registarDivida(e) {
    e.preventDefault();
    const nome = document.getElementById("div-nome").value;
    const tel = document.getElementById("div-tel").value;
    const valor = parseFloat(document.getElementById("div-valor").value);
    const data = document.getElementById("div-data").value;

    dividas.push({ id: Date.now(), nome, tel, valor, data });
    salvarDados();
    e.target.reset();
    carregarTabelaDividas();
    carregarFinancas();
}

function carregarTabelaDividas() {
    const tbody = document.getElementById("tabela-dividas-body");
    const alertaBox = document.getElementById("caixa-alertas-divida");
    if (!tbody) return;
    tbody.innerHTML = "";
    
    const hoje = new Date().toISOString().split("T")[0];
    let temVencidas = false;

    dividas.forEach(d => {
        const vencida = d.data <= hoje;
        if (vencida) temVencidas = true;

        tbody.innerHTML += `
            <tr class="${vencida ? 'divida-vencida' : ''}">
                <td style="padding:10px;"><strong>${d.nome}</strong></td>
                <td style="padding:10px;">${d.tel}</td>
                <td style="padding:10px; color:red; font-weight:bold;">${d.valor.toFixed(2)} MT</td>
                <td style="padding:10px;">${d.data}</td>
                <td style="padding:10px;">${vencida ? '<span style="color:red; font-weight:bold;">⚠️ VENCIDA</span>' : 'Pendente'}</td>
                <td style="padding:10px;">
                    <button onclick="enviarSmsLembrete('${d.tel}', '${d.nome}', ${d.valor}, '${d.data}')" class="btn-secundario" style="padding:4px 8px; font-size:0.8rem;"><i class="fa-brands fa-whatsapp"></i> Cobrar</button>
                    <button onclick="liquidarDivida(${d.id})" class="btn-cadastrar" style="background:#16a34a; padding:4px 8px; font-size:0.8rem;">Pagar</button>
                </td>
            </tr>
        `;
    });

    if (alertaBox) alertaBox.style.display = temVencidas ? "block" : "none";
}

function enviarSmsLembrete(tel, nome, valor, data) {
    const msg = `Olá ${nome}, lembramos o valor de ${valor.toFixed(2)} MT in aberto na nossa Mercearia que vence a ${data}. Obrigado!`;
    window.open(`https://wa.me/258${tel}?text=${encodeURIComponent(msg)}`, '_blank');
}

function liquidarDivida(id) {
    const div = dividas.find(d => d.id === id);
    if (!div) return;

    if (confirm(`Liquidou o valor de ${div.valor.toFixed(2)} MT?`)) {
        historicoVendas.push({
            data: new Date().toLocaleTimeString(),
            dataVenda: new Date().toISOString().split("T")[0],
            metodo: "Recebimento de Dívida",
            total: div.valor,
            lucro: div.valor,
            itens: `Dívida Liquidada - ${div.nome}`,
            detalhesItens: []
        });

        dividas = dividas.filter(d => d.id !== id);
        salvarDados();
        carregarTabelaDividas();
        carregarFinancas();
        carregarRelatorioProdutosVendidosHoje();
    }
}

function registarDespesa(e) {
    if(e) e.preventDefault();
    const desc = document.getElementById("desp-desc").value;
    const valor = parseFloat(document.getElementById("desp-valor").value);
    const data = document.getElementById("desp-data").value;

    despesas.push({ id: Date.now(), desc, valor, data });
    salvarDados();
    if(e) e.target.reset();
    carregarTabelaDespesas();
    carregarFinancas();
}

function carregarTabelaDespesas() {
    const tbody = document.getElementById("tabela-despesas-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    despesas.forEach(d => {
        tbody.innerHTML += `
            <tr>
                <td style="padding:10px;">${d.data}</td>
                <td style="padding:10px;"><strong>${d.desc}</strong></td>
                <td style="padding:10px; color:#ef4444; font-weight:bold;">-${d.valor.toFixed(2)} MT</td>
                <td style="padding:10px;"><button onclick="removerDespesa(${d.id})" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Apagar</button></td>
            </tr>
        `;
    });
}

function removerDespesa(id) {
    if (confirm("Apagar despesa?")) {
        despesas = despesas.filter(d => d.id !== id);
        salvarDados();
        carregarTabelaDespesas();
        carregarFinancas();
    }
}

function arquivarEReiniciarMes() {
    if (historicoVendas.length === 0 && despesas.length === 0) {
        return alert("Não há registos financeiros no mês atual.");
    }
    const nomeMes = prompt("Identificação do Mês (Ex: Julho 2026):");
    if (!nomeMes) return;

    const fat = historicoVendas.reduce((acc, v) => acc + v.total, 0);
    const lucroBruto = historicoVendas.reduce((acc, v) => acc + v.lucro, 0);
    const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0);

    mesesArquivados.push({
        id: Date.now(),
        mes: nomeMes,
        dataFecho: new Date().toLocaleDateString(),
        faturacao: fat,
        lucroBruto: lucroBruto,
        despesasTotal: totalDespesas,
        lucroLiquidoReal: lucroBruto - totalDespesas,
        detalhesDespesas: [...despesas],
        totalVendasQtd: historicoVendas.length
    });

    historicoVendas = [];
    despesas = [];
    transacoesCarteira = []; 
    salvarDados();
    carregarFinancas();
    carregarTabelaDespesas();
    carregarHistoricoArquivado();
    carregarTabelaCarteiras();
    alert("Mês arquivado e contabilidade zerada.");
}

function carregarHistoricoArquivado() {
    const container = document.getElementById("lista-meses-arquivados");
    if (!container) return;
    container.innerHTML = "";

    if (mesesArquivados.length === 0) {
        container.innerHTML = "<p style='color:#64748b;'>Nenhum relatório arquivado.</p>";
        return;
    }

    mesesArquivados.forEach(m => {
        container.innerHTML += `
            <div style="border:1px solid #cbd5e1; background:#f8fafc; border-radius:8px; padding:12px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;" class="card-fade">
                <div>
                    <h4 style="margin:0;">📌 ${m.mes}</h4>
                    <p style="margin:5px 0 0 0; font-size:0.9rem;">
                        Fat: <strong>${m.faturacao.toFixed(2)} MT</strong> | 
                        Desp: <strong style="color:#ef4444;">-${m.despesasTotal.toFixed(2)} MT</strong> | 
                        Lucro: <strong style="color:#16a34a;">${m.lucroLiquidoReal.toFixed(2)} MT</strong>
                    </p>
                </div>
                <div>
                    <button onclick="verDetalhesArquivo(${m.id})" class="btn-secundario" style="padding:5px 10px; font-size:0.85rem;">🔍 Ver Detalhes</button>
                    <button onclick="apagarRelatorioArquivado(${m.id})" style="background:#ef4444; color:white; border:none; padding:6px 10px; border-radius:4px; font-size:0.85rem; cursor:pointer;">🗑️ Apagar</button>
                </div>
            </div>
        `;
    });
}

function verDetalhesArquivo(id) {
    const rel = mesesArquivados.find(m => m.id === id);
    if (!rel) return;
    let txtDespesas = rel.detalhesDespesas.map(d => `- ${d.desc}: ${d.valor.toFixed(2)} MT`).join("\n") || "Sem despesas.";
    alert(`--- RELATÓRIO: ${rel.mes} ---\n\nFaturação: ${rel.faturacao.toFixed(2)} MT\nLucro Bruto: ${rel.lucroBruto.toFixed(2)} MT\nDespesas: ${rel.despesasTotal.toFixed(2)} MT\nLucro Líquido Real: ${rel.lucroLiquidoReal.toFixed(2)} MT\n\n--- DESPESAS ---\n${txtDespesas}`);
}

function apagarRelatorioArquivado(id) {
    if (confirm("Apagar relatório permanentemente?")) {
        mesesArquivados = mesesArquivados.filter(m => m.id !== id);
        salvarDados();
        carregarHistoricoArquivado();
    }
}

function mudarAba(nomeAba) {
    if (nomeAba === 'dono' || nomeAba === 'despesas') return;
    mudarAbaDirecto(nomeAba);
}

function mudarAbaDirecto(nomeAba) {
    document.querySelectorAll('.aba-conteudo').forEach(a => a.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const abaTarget = document.getElementById(`aba-${nomeAba}`);
    if (abaTarget) abaTarget.classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.id === `nav-btn-${nomeAba === 'vendas' ? 'caixa' : nomeAba}`) {
            btn.classList.add('active');
        }
    });

    if (nomeAba === 'cliente') carregarLojaCliente();
    if (nomeAba === 'vendas') {
        carregarProdutosBalcao();
        carregarAvulsoStatusGeral(); 
        popularDropdownFracionamento(); 
    }
    if (nomeAba === 'pedidos') carregarPedidosPendentes();
}

// CADASTRO E AJUSTES DE PRODUTOS
function cadastrarProduto(e) {
    e.preventDefault();
    const nome = document.getElementById("p-nome").value;
    const tipo = document.getElementById("p-tipo").value;
    const categoria = document.getElementById("p-categoria").value;
    const custo = parseFloat(document.getElementById("p-custo").value);
    const preco = parseFloat(document.getElementById("p-venda").value);
    const qtd = parseFloat(document.getElementById("p-qtd").value);
    const imagem = document.getElementById("p-imagem").value;
    const qtdAtacado = parseInt(document.getElementById("p-qtd-atacado").value) || 0;
    const descAtacado = parseFloat(document.getElementById("p-desc-atacado").value) || 0;

    produtos.push({ 
        id: Date.now(), 
        nome, 
        tipo, 
        categoria, 
        custo, 
        preco, 
        qtd, 
        imagem, 
        qtdAtacado, 
        descAtacado 
    });
    
    salvarDados();
    e.target.reset();
    carregarTabelaStock();
    carregarLojaCliente();
    carregarProdutosBalcao();
    alert("Produto cadastrado com sucesso!");
}

function carregarTabelaStock() {
    const tbody = document.getElementById("tabela-stock-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    produtos.forEach(p => {
        let descInfo = "Nenhum";
        if (p.qtdAtacado > 0) {
            descInfo = `${p.descAtacado}% (>= ${p.qtdAtacado})`;
        }

        let imgPreview = p.imagem ? `<img src="${p.imagem}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;">` : `<i class="fa-solid fa-image" style="color:#cbd5e1; font-size:1.5rem;"></i>`;

        tbody.innerHTML += `
            <tr class="card-fade">
                <td style="padding:10px;">${imgPreview}</td>
                <td style="padding:10px;"><strong>${p.nome}</strong></td>
                <td style="padding:10px;"><span class="tag-kg" style="position:static;">${p.categoria}</span></td>
                <td style="padding:10px;">${p.custo.toFixed(2)} MT</td>
                <td style="padding:10px;">
                    <span id="p-preco-view-${p.id}">${p.preco.toFixed(2)} MT</span>
                    <button onclick="editarPreco(${p.id})" style="background:#3b82f6; color:white; border:none; padding:2px 6px; border-radius:4px; margin-left:5px; cursor:pointer; font-size:0.75rem;"><i class="fa-solid fa-pen"></i></button>
                </td>
                <td style="padding:10px; color:#d97706;">${descInfo}</td>
                <td style="padding:10px;">
                    <strong id="p-qtd-view-${p.id}">${p.qtd} ${p.tipo}</strong>
                    <button onclick="ajustarStock(${p.id})" style="background:#f59e0b; color:white; border:none; padding:2px 6px; border-radius:4px; margin-left:5px; cursor:pointer; font-size:0.75rem;">Ajustar</button>
                </td>
                <td style="padding:10px; display:flex; gap:5px;">
                    <button onclick="declararDanificado(${p.id})" style="background:#f59e0b; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;"><i class="fa-solid fa-triangle-exclamation"></i> Danificado</button>
                    <button onclick="removerProduto(${p.id})" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function editarPreco(id) {
    const p = produtos.find(item => item.id === id);
    if (!p) return;
    const novoPreco = parseFloat(prompt(`Digite o novo preço para [${p.nome}]:`, p.preco));
    if (!isNaN(novoPreco) && novoPreco > 0) {
        p.preco = novoPreco;
        salvarDados();
        carregarTabelaStock();
        carregarLojaCliente();
        carregarProdutosBalcao();
        alert("Preço actualizado com sucesso!");
    }
}

function ajustarStock(id) {
    const p = produtos.find(item => item.id === id);
    if (!p) return;
    const novaQtd = parseFloat(prompt(`Ajustar stock físico de [${p.nome}].\nQuantidade digital atual: ${p.qtd} ${p.tipo}.\nIntroduza a quantidade real medida:`, p.qtd));
    if (!isNaN(novaQtd) && novaQtd >= 0) {
        p.qtd = novaQtd;
        salvarDados();
        carregarTabelaStock();
        carregarLojaCliente();
        carregarProdutosBalcao();
        alert("Stock ajustado fisicamente!");
    }
}

function declararDanificado(id) {
    const p = produtos.find(item => item.id === id);
    if (!p) return;

    const qtdDanificada = parseFloat(prompt(`Quantas unidades/KG/L de [${p.nome}] foram danificadas?`));
    if (isNaN(qtdDanificada) || qtdDanificada <= 0 || qtdDanificada > p.qtd) {
        return alert("Quantidade inválida ou superior ao stock existente!");
    }

    if (confirm(`Confirmar o abate de ${qtdDanificada} ${p.tipo} de [${p.nome}] por danificação?`)) {
        p.qtd = parseFloat((p.qtd - qtdDanificada).toFixed(3));
        const custoPrejuizo = p.custo * qtdDanificada;

        despesas.push({
            id: Date.now(),
            desc: `Prejuízo: Danificação de ${p.nome} (${qtdDanificada} ${p.tipo})`,
            valor: custoPrejuizo,
            data: new Date().toISOString().split("T")[0]
        });

        salvarDados();
        carregarTabelaStock();
        carregarTabelaDespesas();
        carregarFinancas();
        alert(`Perda registada! ${custoPrejuizo.toFixed(2)} MT adicionados às despesas da loja.`);
    }
}

// REMOVER
function removerProduto(id) {
    if (confirm("Apagar produto do inventário?")) {
        produtos = produtos.filter(p => p.id !== id);
        salvarDados();
        carregarTabelaStock();
        carregarLojaCliente();
        carregarProdutosBalcao();
    }
}

function carregarFinancas() {
    const fat = historicoVendas.reduce((acc, v) => acc + v.total, 0);
    const lucroBruto = historicoVendas.reduce((acc, v) => acc + v.lucro, 0);
    const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0);
    const lucroLiquidoReal = lucroBruto - totalDespesas;
    const totDiv = dividas.reduce((acc, d) => acc + d.valor, 0);

    const faturacaoEl = document.getElementById("fin-faturacao");
    const despesasEl = document.getElementById("fin-despesas");
    const lucroEl = document.getElementById("fin-lucro");
    const dividasEl = document.getElementById("fin-dividas");

    if (faturacaoEl) faturacaoEl.innerText = `${fat.toFixed(2)} MT`;
    if (despesasEl) despesasEl.innerText = `${totalDespesas.toFixed(2)} MT`;
    if (lucroEl) {
        lucroEl.innerText = `${lucroLiquidoReal.toFixed(2)} MT`;
        lucroEl.style.color = lucroLiquidoReal >= 0 ? "#16a34a" : "#ef4444";
    }
    if (dividasEl) dividasEl.innerText = `${totDiv.toFixed(2)} MT`;
}

function alterarSenhaDono() {
    const nova = prompt("Nova palavra-passe do Dono:");
    if (nova) {
        senhaDono = nova;
        salvarDados();
        alert("Palavra-passe alterada!");
    }
}

function alterarSenhaAtendente() {
    const nova = prompt("Nova palavra-passe do Atendente:");
    if (nova) {
        senhaAtendente = nova;
        salvarDados();
        alert("Palavra-passe do Atendente alterada com sucesso!");
    }
}

// ==========================================
// NOVO SISTEMA UNIVERSAL: PRODUTOS AVULSOS
// ==========================================
function carregarAvulsoStatusGeral() {
    const statusEl = document.getElementById("oleo-avulso-status");
    if (!statusEl) return;
    
    let htmlContent = "<strong>Reservatórios de Artigos Avulsos Abertos:</strong><br>";
    let keys = Object.keys(produtosAvulsosEstoque);
    
    if(keys.length === 0) {
        htmlContent += "<span style='color:#64748b; font-weight:normal;'>Nenhum contentor/saco aberto neste momento.</span>";
    } else {
        keys.forEach(id => {
            let item = produtosAvulsosEstoque[id];
            htmlContent += `• <strong>${item.nome}:</strong> ${item.saldoAvulso.toFixed(2)} ${item.unidadeMedida}<br>`;
        });
    }
    statusEl.innerHTML = htmlContent;
}

function popularDropdownFracionamento() {
    const selectProds = document.getElementById("oleo-garrafas-disponiveis");
    if(!selectProds) return;
    
    selectProds.innerHTML = `<option value="">-- Selecione um artigo inteiro do stock --</option>`;
    
    produtos.forEach(p => {
        if(p.qtd >= 1) {
            selectProds.innerHTML += `<option value="${p.id}">${p.nome} (Stock: ${p.qtd} ${p.tipo})</option>`;
        }
    });
}

function confirmarFracionamentoOleo() {
    const prodId = parseInt(document.getElementById("oleo-garrafas-disponiveis").value);
    const capacity = parseFloat(document.getElementById("oleo-litragem-garrafa").value);

    if (isNaN(prodId) || isNaN(capacity) || capacity <= 0) {
        return alert("Por favor, selecione um artigo válido e introduza a capacidade métrica (Ex: 25 para saco de 25kg, 5 para garrafa de 5L)!");
    }

    const p = produtos.find(item => item.id === prodId);
    if (!p || p.qtd < 1) return alert("Não há unidades suficientes deste artigo em stock!");

    if (confirm(`Deseja abrir 1 unidade de [${p.nome}] e transferir ${capacity} para o balcão avulso de retalho?`)) {
        p.qtd = parseFloat((p.qtd - 1).toFixed(3)); 
        
        if (!produtosAvulsosEstoque[p.id]) {
            produtosAvulsosEstoque[p.id] = {
                id: p.id,
                nome: p.nome + " (Avulso)",
                saldoAvulso: 0,
                unidadeMedida: p.nome.toLowerCase().includes("óleo") || p.nome.toLowerCase().includes("oleo") ? "L" : "KG",
                precoOriginalPai: p.preco,
                custoOriginalPai: p.custo,
                capacidadeUnidadePai: capacity
            };
        }
        
        produtosAvulsosEstoque[p.id].saldoAvulso += capacity;
        
        salvarDados();
        carregarTabelaStock();
        carregarAvulsoStatusGeral();
        popularDropdownFracionamento();
        alert(`Sucesso! 1 unidade de ${p.nome} foi aberta e convertida para venda fracionada.`);
    }
}

function venderOleoAvulso() {
    let keys = Object.keys(produtosAvulsosEstoque);
    if(keys.length === 0) return alert("Não existem produtos fracionados abertos no momento! Abra um produto primeiro no menu acima.");
    
    let menuLista = "Introduza o número correspondente ao produto que quer vender avulso:\n\n";
    keys.forEach((id, index) => {
        let item = produtosAvulsosEstoque[id];
        menuLista += `${index + 1} - ${item.nome} (Saldo atual: ${item.saldoAvulso.toFixed(2)} ${item.unidadeMedida})\n`;
    });
    
    let escolhaIndex = parseInt(prompt(menuLista)) - 1;
    if(isNaN(escolhaIndex) || escolhaIndex < 0 || escolhaIndex >= keys.length) return alert("Opção inválida!");
    
    let idEscolhido = keys[escolhaIndex];
    let artigoAvulso = produtosAvulsosEstoque[idEscolhido];

    const valorMT = parseFloat(prompt(`Venda de ${artigoAvulso.nome}.\nDigite o VALOR EM METICAIS (MT) que o cliente quer gastar:`));
    if (isNaN(valorMT) || valorMT <= 0) return alert("Valor inválido!");

    let precoPorUnidadeMedida = (artigoAvulso.precoOriginalPai / artigoAvulso.capacidadeUnidadePai);
    let quantidadeGasta = parseFloat((valorMT / precoPorUnidadeMedida).toFixed(3));

    if (artigoAvulso.saldoAvulso < quantidadeGasta) {
        return alert(`Quantidade em stock insuficiente! Faltam ${quantidadeGasta.toFixed(2)} ${artigoAvulso.unidadeMedida}, mas só restam ${artigoAvulso.saldoAvulso.toFixed(2)} ${artigoAvulso.unidadeMedida}.\nPor favor, abra outro artigo no menu acima.`);
    }

    if (confirm(`Vender ${quantidadeGasta.toFixed(2)} ${artigoAvulso.unidadeMedida} de [${artigoAvulso.nome}] por ${valorMT.toFixed(2)} MT?`)) {
        artigoAvulso.saldoAvulso -= quantidadeGasta;
        
        if(artigoAvulso.saldoAvulso <= 0) {
            delete produtosAvulsosEstoque[idEscolhido];
        }

        let custoProporcional = (artigoAvulso.custoOriginalPai / artigoAvulso.capacidadeUnidadePai) * quantidadeGasta;
        let lucroAvulso = valorMT - custoProporcional;

        historicoVendas.push({
            data: new Date().toLocaleTimeString(),
            dataVenda: new Date().toISOString().split("T")[0],
            metodo: "Numerário",
            total: valorMT,
            lucro: lucroAvulso,
            itens: `${artigoAvulso.nome} (${quantidadeGasta.toFixed(2)} ${artigoAvulso.unidadeMedida})`,
            detalhesItens: [{ nome: artigoAvulso.nome, qtd: quantidadeGasta, tipo: artigoAvulso.unidadeMedida }]
        });

        salvarDados();
        carregarAvulsoStatusGeral();
        carregarFinancas();
        alert("Artigo avulso fracionado, vendido e abatido com sucesso!");
        carregarRelatorioProdutosVendidosHoje();
    }
}

// ==========================================
// NOVO SISTEMA DE RELATÓRIO DIÁRIO DE PRODUTOS
// ==========================================
function carregarRelatorioProdutosVendidosHoje() {
    const container = document.getElementById("lista-produtos-vendidos-hoje");
    if (!container) return;
    container.innerHTML = "";

    const hojeStr = new Date().toISOString().split("T")[0];
    let vendasDeHoje = historicoVendas.filter(v => v.dataVenda === hojeStr);
    let produtosAgrupados = {};

    vendasDeHoje.forEach(venda => {
        if (venda.detalhesItens && Array.isArray(venda.detalhesItens)) {
            venda.detalhesItens.forEach(item => {
                if (!produtosAgrupados[item.nome]) {
                    produtosAgrupados[item.nome] = { qtd: 0, tipo: item.tipo || "UNI" };
                }
                produtosAgrupados[item.nome].qtd += item.qtd;
            });
        }
    });

    let chaves = Object.keys(produtosAgrupados);
    if (chaves.length === 0) {
        container.innerHTML = "<p style='color:#64748b; font-style:italic; padding:10px;'>Nenhum artigo físico foi faturado hoje até ao momento.</p>";
        return;
    }

    let tabelaHtml = `
        <table style="width:100%; border-collapse:collapse; background:white; border-radius:8px; overflow:hidden;">
            <thead>
                <tr style="background:#e2e8f0; text-align:left;">
                    <th style="padding:10px;">Artigo / Produto Vendido</th>
                    <th style="padding:10px; text-align:center;">Quantidade Total Saída Hoje</th>
                </tr>
            </thead>
            <tbody>
    `;

    chaves.forEach(nomeProd => {
        let dados = produtosAgrupados[nomeProd];
        tabelaHtml += `
            <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:10px;">📦 <strong>${nomeProd}</strong></td>
                <td style="padding:10px; text-align:center; color:#2563eb; font-weight:bold;">${dados.qtd.toFixed(2)} ${dados.tipo}</td>
            </tr>
        `;
    });

    tabelaHtml += `</tbody></table>`;
    container.innerHTML = tabelaHtml;
}

// CARTEIRAS MÓVEIS (M-PESA / E-MOLA)
function registarTransacaoCarteira(e) {
    e.preventDefault();
    const tipo = document.getElementById("cart-tipo").value;
    const operacao = document.getElementById("cart-operacao").value;
    const valor = parseFloat(document.getElementById("cart-valor").value);
    const taxaAgente = parseFloat(document.getElementById("cart-taxa").value) || 0;

    transacoesCarteira.push({
        id: Date.now(),
        data: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
        tipo,
        operacao,
        valor,
        taxaAgente
    });

    if (taxaAgente > 0) {
        historicoVendas.push({
            data: new Date().toLocaleTimeString(),
            dataVenda: new Date().toISOString().split("T")[0],
            metodo: tipo,
            total: taxaAgente,
            lucro: taxaAgente,
            itens: `Comissão de ${operacao} (${tipo})`,
            detalhesItens: []
        });
    }

    salvarDados();
    e.target.reset();
    carregarTabelaCarteiras();
    carregarFinancas();
    alert("Operação registada!");
}

function carregarTabelaCarteiras() {
    const tbody = document.getElementById("tabela-carteiras-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    let totalDepositos = 0;
    let totalLevantamentos = 0;
    let totalComissoes = 0;

    transacoesCarteira.forEach(t => {
        if (t.operacao === "Depósito") totalDepositos += t.valor;
        if (t.operacao === "Levantamento") totalLevantamentos += t.valor;
        totalComissoes += t.taxaAgente;

        tbody.innerHTML += `
            <tr>
                <td style="padding:10px;">${t.data}</td>
                <td style="padding:10px;"><strong>${t.tipo}</strong></td>
                <td style="padding:10px; color:${t.operacao === 'Depósito' ? '#16a34a' : '#2563eb'}; font-weight:bold;">${t.operacao}</td>
                <td style="padding:10px;">${t.valor.toFixed(2)} MT</td>
                <td style="padding:10px; color:#16a34a; font-weight:bold;">+${t.taxaAgente.toFixed(2)} MT</td>
                <td style="padding:10px;"><button onclick="removerTransacaoCarteira(${t.id})" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Apagar</button></td>
            </tr>
        `;
    });

    const d1 = document.getElementById("cart-resumo-depositos");
    const d2 = document.getElementById("cart-resumo-levantamentos");
    const d3 = document.getElementById("cart-resumo-comissoes");
    if(d1) d1.innerText = `${totalDepositos.toFixed(2)} MT`;
    if(d2) d2.innerText = `${totalLevantamentos.toFixed(2)} MT`;
    if(d3) d3.innerText = `${totalComissoes.toFixed(2)} MT`;
}

function removerTransacaoCarteira(id) {
    if (confirm("Deseja apagar este registo?")) {
        transacoesCarteira = transacoesCarteira.filter(t => t.id !== id);
        salvarDados();
        carregarTabelaCarteiras();
        carregarFinancas();
    }
}

function filtrarProdutos() {
    const termo = document.getElementById("search-bar").value.toLowerCase();
    carregarProdutosBalcao(produtos.filter(p => p.nome.toLowerCase().includes(termo)));
}

function filtrarProdutosCliente() {
    const termo = document.getElementById("search-bar-cliente").value.toLowerCase();
    carregarLojaCliente(produtos.filter(p => p.nome.toLowerCase().includes(termo)));
}

// Inicialização Unificada
window.addEventListener('DOMContentLoaded', () => {
    if (clienteLogadoTel && contasClientes[clienteLogadoTel]) {
        entrarSessaoCliente(clienteLogadoTel);
    } else {
        carregarLojaCliente();
    }
    atualizarBadges();
    verificarPerfilAcesso();
});
// LÓGICA DO PÍXEL INVISÍVEL (3 CLIQUES)
let cliquesSecretos = 0;
let tempoUltimoClique = 0;

function contarCliquesSecretos() {
    const agora = Date.now();
    
    // Se o tempo entre os cliques for maior que 1 segundo, reinicia a contagem
    if (agora - tempoUltimoClique > 1000) {
        cliquesSecretos = 0;
    }
    
    cliquesSecretos++;
    tempoUltimoClique = agora;
    
    // Quando atingir os 3 cliques rápidos, abre o login
    if (cliquesSecretos === 3) {
        cliquesSecretos = 0; // Reinicia o contador
        iniciarLoginModoAdministrativo();
    }
}