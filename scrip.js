document.addEventListener('DOMContentLoaded', () => {
    // --- Referências DOM ---
    const appContent = document.getElementById('app-content');
    const navAuthBtn = document.getElementById('nav-auth-btn');
    const navContribuir = document.getElementById('nav-contribuir');
    const userStatusFooter = document.getElementById('user-status-footer');
    const navLinks = document.querySelector('.nav-links');
    const burger = document.querySelector('.burger');

    // Referências para os novos links
    const navMinhasPostagens = document.getElementById('nav-minhaspostagens');
    const navMinhaConta = document.getElementById('nav-minhaconta');


    // --- Estado Global ---
    let state = {
        isLoggedIn: false,
        userName: "Usuário Fantoche",
        userEmail: "fantocheiro@exemplo.com", // Novo dado
        contribuicoes: [
            { id: 1, titulo: "Fantoche de Meia", autor: "Maria C.", tipo: "Construção", texto: "Tutorial para criar fantoches de meias velhas.", imagemUrl: "https://via.placeholder.com/320x220?text=Fantoche+Meia" },
            { id: 2, titulo: "Voz e Diálogo Cativante", autor: "João A.", tipo: "Roteiro", texto: "Dicas de voz e como criar diálogos que prendem a atenção.", imagemUrl: "https://via.placeholder.com/320x220?text=Vozes+e+Roteiro" },
            { id: 3, titulo: "Manipulação Avançada", autor: "Ana L.", tipo: "Técnica", texto: "Movimentos sutis para dar mais vida e emoção aos seus bonecos.", imagemUrl: "https://via.placeholder.com/320x220?text=Tecnica+Avancada" }
        ],
        minhasPostagens: [ // Dados simulados das postagens do usuário logado
            { id: 101, titulo: "Caixa de Luz para Teatro", tipo: "Técnica", texto: "Dicas de iluminação barata e eficaz para seu teatro.", imagemUrl: "https://via.placeholder.com/320x220?text=Caixa+Luz" },
            { id: 102, titulo: "Fantoches de Luva", tipo: "Construção", texto: "Como fazer um fantoche de luva articulado.", imagemUrl: "https://via.placeholder.com/320x220?text=Fantoche+Luva" }
        ],
        currentPage: 'home'
    };

    // --- Template de Renderização ---

    // Função auxiliar para renderizar um item (mantida)
    const renderContribuicaoItem = (item) => `
        <div class="contribuicao-item">
            <img src="${item.imagemUrl}" alt="${item.titulo}">
            <div class="contribuicao-content">
                <h3>${item.titulo}</h3>
                <p>${item.texto.substring(0, 95)}...</p>
                <div class="contribuicao-meta">
                    <i class="fas fa-user"></i> ${item.autor ? item.autor : state.userName} | <i class="fas fa-tag"></i> ${item.tipo}
                </div>
            </div>
        </div>
    `;

    // Renderização da Home (mantida)
    const renderHome = () => `
        <section id="objetivo" class="card">
            <h2>🎯 Bem-vindo(a) ao FantocheMundo</h2>
            <p>Nossa missão é ser o ponto de encontro da criatividade para fantocheiros de todos os níveis. Aqui, você encontra **tutoriais**, **inspirações** e um espaço para **compartilhar** sua paixão pela arte de dar vida a bonecos.</p>
            <p>Seja você um contador de histórias de longa data ou um novato curioso, explore nossa comunidade e comece a criar!</p>
            <button class="btn-submit" onclick="navigate('comunidade')">Ver Contribuições</button>
        </section>
        
        <section class="card">
            <h2>📢 Últimas Dicas</h2>
            <div class="grid-layout">
                ${state.contribuicoes.slice(0, 2).map(item => renderContribuicaoItem(item)).join('')}
            </div>
            <p style="text-align: center; margin-top: 20px;"><a href="#" onclick="navigate('comunidade')">Ver todas as ${state.contribuicoes.length} dicas >></a></p>
        </section>
    `;

    // Renderização da Comunidade (mantida)
    const renderComunidade = () => `
        <section class="card">
            <h2>💬 Comunidade em Destaque</h2>
            <p>Navegue pelas melhores ideias e tutoriais enviados por nossos membros.</p>
            <div class="grid-layout">
                ${state.contribuicoes.map(item => renderContribuicaoItem(item)).join('')}
            </div>
            ${state.contribuicoes.length === 0 ? '<p style="text-align: center;">Nenhuma contribuição ainda. Seja o primeiro!</p>' : ''}
        </section>
    `;

    // Renderização do Formulário de Contribuição (mantida)
    const renderContribuirForm = () => `
        <section class="card">
            <h2>➕ Compartilhe sua Arte</h2>
            ${state.isLoggedIn ? `
                <form id="contribuicao-form">
                    <label for="titulo">Título da Dica:</label>
                    <input type="text" id="titulo" name="titulo" required>

                    <label for="tipo">Categoria:</label>
                    <select id="tipo" name="tipo">
                        <option value="construcao">Construção (Materiais, DIY)</option>
                        <option value="roteiro">Roteiro/História</option>
                        <option value="tecnica">Técnica de Manipulação</option>
                        <option value="outro">Outro</option>
                    </select>

                    <label for="texto">Texto ou Descrição:</label>
                    <textarea id="texto" name="texto" rows="6" required></textarea>

                    <label for="imagem">Enviar Imagem/Foto:</label>
                    <input type="file" id="imagem" name="imagem" accept="image/*">
                    
                    <button type="submit" class="btn-submit">Enviar Contribuição</button>
                </form>
                <p id="envio-status" class="hidden alert-success"></p>
            ` : `
                <p><strong>Você precisa estar logado para enviar uma contribuição.</strong></p>
                <button class="btn-submit" onclick="handleAuth()">Faça Login com Google</button>
            `}
        </section>
    `;

    // NOVO: Renderização da Página Minha Conta
    const renderMinhaConta = () => `
        <section class="card">
            <h2>👤 Minha Conta</h2>
            ${state.isLoggedIn ? `
                <div class="user-info" style="font-size: 1.1em; line-height: 2;">
                    <p><strong>Nome de Usuário:</strong> ${state.userName}</p>
                    <p><strong>E-mail:</strong> ${state.userEmail}</p>
                    <p><strong>Membro Desde:</strong> Janeiro de 2024 (Simulação)</p>
                    <p><strong>Total de Contribuições:</strong> ${state.minhasPostagens.length}</p>
                    
                    <h3 style="margin-top: 30px; color: #5d0c8b;">Gerenciamento</h3>
                    <button class="btn-submit" style="background-color: #3f90ff; margin-right: 15px;">
                        <i class="fas fa-key"></i> Mudar Senha (Simulação)
                    </button>
                    <button class="btn-submit" style="background-color: #dc3545;" onclick="handleAuth()">
                        <i class="fas fa-sign-out-alt"></i> Sair da Conta
                    </button>
                </div>
            ` : `
                <p>Você precisa estar logado para gerenciar sua conta.</p>
                <button class="btn-submit" onclick="handleAuth()">Faça Login com Google</button>
            `}
        </section>
    `;

    // NOVO: Renderização da Página Minhas Postagens
    const renderMinhasPostagens = () => `
        <section class="card">
            <h2>📦 Minhas Contribuições</h2>
            <p>Seu histórico de ideias e dicas compartilhadas. Você pode editar ou excluir daqui.</p>
            
            ${state.isLoggedIn ? `
                <div class="grid-layout">
                    ${state.minhasPostagens.length > 0 ? 
                        state.minhasPostagens.map(item => `
                            <div class="contribuicao-item" style="border-left: 5px solid #28a745;">
                                <img src="${item.imagemUrl}" alt="${item.titulo}">
                                <div class="contribuicao-content">
                                    <h3>${item.titulo}</h3>
                                    <p style="font-style: italic;">${item.texto.substring(0, 70)}...</p>
                                    <div class="contribuicao-meta">
                                        <i class="fas fa-edit"></i> <a href="#" onclick="alert('Funcionalidade de edição (Back-end) acionada!')" style="margin-right: 10px;">Editar</a> | 
                                        <i class="fas fa-trash-alt"></i> <a href="#" onclick="alert('Funcionalidade de exclusão (Back-end) acionada!')" style="color: #dc3545;">Excluir</a>
                                    </div>
                                </div>
                            </div>
                        `).join('')
                        : `<p style="text-align: center; margin-top: 20px;">Você ainda não tem postagens. <a href="#" onclick="navigate('contribuir')">Comece a compartilhar!</a></p>`
                    }
                </div>
            ` : `
                <p>Faça login para ver suas postagens.</p>
                <button class="btn-submit" onclick="handleAuth()">Faça Login com Google</button>
            `}
        </section>
    `;


    // --- Funções de Controle ---

    // Função de Roteamento/SPA (Atualizada com NOVAS páginas)
    window.navigate = (page) => {
        state.currentPage = page;
        appContent.innerHTML = ''; 
        
        appContent.innerHTML = '<div class="loading-state" style="text-align: center; padding: 50px;">Carregando...</div>';

        setTimeout(() => {
            switch (page) {
                case 'home':
                    appContent.innerHTML = renderHome();
                    break;
                case 'comunidade':
                    appContent.innerHTML = renderComunidade();
                    break;
                case 'contribuir':
                    appContent.innerHTML = renderContribuirForm();
                    if (state.isLoggedIn) {
                         attachFormListener();
                    }
                    break;
                case 'minhaconta': // NOVO
                    appContent.innerHTML = renderMinhaConta();
                    break;
                case 'minhaspostagens': // NOVO
                    appContent.innerHTML = renderMinhasPostagens();
                    break;
                default:
                    appContent.innerHTML = '<div class="card"><h2>Página Não Encontrada</h2><p>Parece que você se perdeu no teatro!</p></div>';
            }
            navLinks.classList.remove('nav-active'); 
        }, 500);
    };
    
    // Lidar com o Formulário (Anexar Evento)
    const attachFormListener = () => {
        const contribuicaoForm = document.getElementById('contribuicao-form');
        const envioStatus = document.getElementById('envio-status');

        if (!contribuicaoForm) return;

        contribuicaoForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formData = new FormData(contribuicaoForm);
            
            const novaContribuicao = {
                id: Date.now(),
                titulo: formData.get('titulo'),
                tipo: formData.get('tipo'),
                texto: formData.get('texto'),
                autor: state.userName,
                imagemUrl: formData.get('imagem').name ? 'https://via.placeholder.com/320x220?text=Nova+Dica' : 'https://via.placeholder.com/320x220?text=Sem+Imagem'
            };

            // Adiciona a contribuição à lista geral e à lista do usuário
            state.contribuicoes.unshift(novaContribuicao);
            state.minhasPostagens.unshift(novaContribuicao);
            
            envioStatus.textContent = `Sucesso! Sua dica "${novaContribuicao.titulo}" foi adicionada.`;
            envioStatus.classList.remove('hidden');
            contribuicaoForm.reset();
        });
    }

    // Funções de Autenticação (Mantidas)
    window.handleAuth = function() {
        if (state.isLoggedIn) {
            fazerLogout();
        } else {
            iniciarLogin();
        }
    };

    const iniciarLogin = () => {
        console.log("Iniciando Login do Google...");
        setTimeout(() => {
            state.isLoggedIn = true;
            alert(`Bem-vindo(a) de volta, ${state.userName}!`);
            updateAuthState();
            navigate('minhaconta'); // Redireciona para Minha Conta após o login
        }, 1500);
    };

    const fazerLogout = () => {
        state.isLoggedIn = false;
        alert("Você saiu da sua conta.");
        updateAuthState();
        navigate('home');
    };

    // Atualização do Estado de Autenticação (Atualizada para mostrar NOVOS links)
    const updateAuthState = () => {
        if (state.isLoggedIn) {
            navAuthBtn.textContent = 'Sair';
            navContribuir.classList.remove('hidden');
            navMinhasPostagens.classList.remove('hidden'); // MOSTRAR
            navMinhaConta.classList.remove('hidden');     // MOSTRAR
            userStatusFooter.textContent = `Conectado como ${state.userName}`;
        } else {
            navAuthBtn.textContent = 'Entrar';
            navContribuir.classList.add('hidden');
            navMinhasPostagens.classList.add('hidden');  // ESCONDER
            navMinhaConta.classList.add('hidden');       // ESCONDER
            userStatusFooter.textContent = 'Desconectado';
        }
    };
    
    // --- Inicialização ---
    
    // Menu Hamburguer
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });
    
    // Navegação via clique nos links
    navLinks.addEventListener('click', (e) => {
        const page = e.target.closest('a')?.getAttribute('data-page');
        if (page) {
            e.preventDefault();
            navigate(page);
        }
    });

    // Carregar a página inicial ao iniciar
    navigate('home');
    updateAuthState();
});
