document.addEventListener('DOMContentLoaded', function() {
    // Dados de exemplo (seriam carregados do localStorage)
    const questoesDB = [
        {
            id: 1,
            enunciado: "Qual é a capital do Brasil?",
            alternativas: ["Rio de Janeiro", "Brasília", "São Paulo", "Salvador"],
            resposta: 1,
            disciplina: "Geografia",
            assunto: "Capitais Brasileiras",
            dificuldade: "facil",
            prova: "ENEM 2023"
        },
        {
            id: 2,
            enunciado: "Quem escreveu 'Dom Casmurro'?",
            alternativas: ["Machado de Assis", "Carlos Drummond de Andrade", "Clarice Lispector", "Jorge Amado"],
            resposta: 0,
            disciplina: "Literatura",
            assunto: "Obras Literárias",
            dificuldade: "medio",
            prova: "ENEM 2022"
        },
        // Adicione mais questões conforme necessário
    ];

    // Elementos do DOM
    const modosSimulado = document.querySelectorAll('.modo-card');
    const filtrosContainer = document.getElementById('filtros-container');
    const simuladoContainer = document.getElementById('simulado-container');
    const resultadoContainer = document.getElementById('resultado-container');
    const btnIniciarSimulado = document.getElementById('btn-iniciar-simulado');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnProxima = document.getElementById('btn-proxima');
    const btnFinalizar = document.getElementById('btn-finalizar');
    const btnNovoSimulado = document.getElementById('btn-novo-simulado');
    const btnVerCorrecao = document.getElementById('btn-ver-correcao');

    // Variáveis de estado
    let modoSelecionado = null;
    let simuladoAtual = [];
    let respostasUsuario = [];
    let questaoAtualIndex = 0;
    let timerInterval;
    let tempoDecorrido = 0;

    // Inicialização
    carregarDisciplinas();
    carregarAssuntos();

    // Event Listeners
    modosSimulado.forEach(modo => {
        modo.addEventListener('click', function() {
            selecionarModo(this.id);
        });
    });

    btnIniciarSimulado.addEventListener('click', iniciarSimulado);
    btnAnterior.addEventListener('click', questaoAnterior);
    btnProxima.addEventListener('click', proximaQuestao);
    btnFinalizar.addEventListener('click', finalizarSimulado);
    btnNovoSimulado.addEventListener('click', reiniciarSimulado);
    btnVerCorrecao.addEventListener('click', verCorrecao);

    // Funções
    function selecionarModo(modoId) {
        modoSelecionado = modoId.replace('modo-', '');
        
        // Atualizar UI
        modosSimulado.forEach(modo => {
            modo.classList.remove('selecionado');
        });
        document.getElementById(modoId).classList.add('selecionado');
        
        // Mostrar filtros correspondentes
        filtrosContainer.classList.remove('hidden');
        
        // Scroll para os filtros
        filtrosContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function carregarDisciplinas() {
        const disciplinasContainer = document.getElementById('filtro-disciplinas');
        const disciplinas = [...new Set(questoesDB.map(q => q.disciplina))];
        
        disciplinas.forEach(disciplina => {
            const option = document.createElement('label');
            option.className = 'filtro-option';
            option.innerHTML = `
                <input type="checkbox" name="disciplina" value="${disciplina}" checked>
                ${disciplina}
            `;
            disciplinasContainer.appendChild(option);
        });
    }

    function carregarAssuntos() {
        const assuntosContainer = document.getElementById('filtro-assuntos');
        const assuntos = [...new Set(questoesDB.map(q => q.assunto))];
        
        assuntos.forEach(assunto => {
            const option = document.createElement('label');
            option.className = 'filtro-option';
            option.innerHTML = `
                <input type="checkbox" name="assunto" value="${assunto}" checked>
                ${assunto}
            `;
            assuntosContainer.appendChild(option);
        });
    }

    function iniciarSimulado() {
        // Obter filtros selecionados
        const disciplinasSelecionadas = Array.from(document.querySelectorAll('input[name="disciplina"]:checked')).map(el => el.value);
        const assuntosSelecionados = Array.from(document.querySelectorAll('input[name="assunto"]:checked')).map(el => el.value);
        const dificuldadesSelecionadas = Array.from(document.querySelectorAll('input[name="dificuldade"]:checked')).map(el => el.value);
        const quantidadeQuestoes = parseInt(document.getElementById('quantidade-questoes').value);
        
        // Filtrar questões
        simuladoAtual = questoesDB.filter(q => {
            return (
                disciplinasSelecionadas.includes(q.disciplina) &&
                assuntosSelecionados.includes(q.assunto) &&
                dificuldadesSelecionadas.includes(q.dificuldade)
            );
        });
        
        // Limitar quantidade
        simuladoAtual = simuladoAtual.slice(0, quantidadeQuestoes);
        
        if (simuladoAtual.length === 0) {
            alert('Nenhuma questão encontrada com esses filtros!');
            return;
        }
        
        // Iniciar estado do simulado
        respostasUsuario = Array(simuladoAtual.length).fill(null);
        questaoAtualIndex = 0;
        tempoDecorrido = 0;
        
        // Atualizar UI
        document.getElementById('simulado-titulo').textContent = `Simulado ${modoSelecionado.charAt(0).toUpperCase() + modoSelecionado.slice(1)}`;
        document.getElementById('total-questoes').textContent = simuladoAtual.length;
        
        // Esconder filtros e mostrar simulado
        filtrosContainer.classList.add('hidden');
        simuladoContainer.classList.remove('hidden');
        
        // Iniciar timer
        iniciarTimer();
        
        // Mostrar primeira questão
        mostrarQuestao();
    }

    function mostrarQuestao() {
        const questao = simuladoAtual[questaoAtualIndex];
        const questaoContainer = document.getElementById('questao-container');
        
        // Atualizar progresso
        document.getElementById('questao-atual').textContent = questaoAtualIndex + 1;
        document.getElementById('progresso-simulado').value = ((questaoAtualIndex + 1) / simuladoAtual.length) * 100;
        
        // Mostrar questão
        questaoContainer.innerHTML = `
            <div class="questao-texto">${questao.enunciado}</div>
            <div class="alternativas-list" id="alternativas-list">
                ${questao.alternativas.map((alt, index) => `
                    <div class="alternativa-item" data-index="${index}">
                        <div class="alternativa-letra">${String.fromCharCode(65 + index)}</div>
                        <div class="alternativa-texto">${alt}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Marcar resposta selecionada se existir
        if (respostasUsuario[questaoAtualIndex] !== null) {
            const alternativaSelecionada = document.querySelector(`.alternativa-item[data-index="${respostasUsuario[questaoAtualIndex]}"]`);
            if (alternativaSelecionada) {
                alternativaSelecionada.classList.add('selecionada');
            }
        }
        
        // Adicionar event listeners às alternativas
        document.querySelectorAll('.alternativa-item').forEach(item => {
            item.addEventListener('click', function() {
                selecionarAlternativa(this);
            });
        });
        
        // Atualizar botões de navegação
        btnAnterior.disabled = questaoAtualIndex === 0;
        btnProxima.style.display = questaoAtualIndex < simuladoAtual.length - 1 ? 'block' : 'none';
        btnFinalizar.style.display = questaoAtualIndex === simuladoAtual.length - 1 ? 'block' : 'none';
    }

    function selecionarAlternativa(element) {
        // Remover seleção anterior
        document.querySelectorAll('.alternativa-item').forEach(item => {
            item.classList.remove('selecionada');
        });
        
        // Adicionar seleção atual
        element.classList.add('selecionada');
        
        // Salvar resposta
        const indexAlternativa = parseInt(element.getAttribute('data-index'));
        respostasUsuario[questaoAtualIndex] = indexAlternativa;
    }

    function questaoAnterior() {
        if (questaoAtualIndex > 0) {
            questaoAtualIndex--;
            mostrarQuestao();
        }
    }

    function proximaQuestao() {
        if (questaoAtualIndex < simuladoAtual.length - 1) {
            questaoAtualIndex++;
            mostrarQuestao();
        }
    }

    function iniciarTimer() {
        // Limpar timer existente
        if (timerInterval) clearInterval(timerInterval);
        
        // Atualizar a cada segundo
        timerInterval = setInterval(function() {
            tempoDecorrido++;
            atualizarTimer();
        }, 1000);
    }

    function atualizarTimer() {
        const minutos = Math.floor(tempoDecorrido / 60).toString().padStart(2, '0');
        const segundos = (tempoDecorrido % 60).toString().padStart(2, '0');
        document.getElementById('timer').innerHTML = `<i class="fas fa-clock"></i> ${minutos}:${segundos}`;
    }

    function finalizarSimulado() {
        // Parar timer
        clearInterval(timerInterval);
        
        // Calcular resultado
        const resultado = calcularResultado();
        
        // Mostrar resultado
        mostrarResultado(resultado);
        
        // Esconder simulado e mostrar resultado
        simuladoContainer.classList.add('hidden');
        resultadoContainer.classList.remove('hidden');
    }

    function calcularResultado() {
        let acertos = 0;
        const resultadoPorDisciplina = {};
        
        simuladoAtual.forEach((questao, index) => {
            const respostaUsuario = respostasUsuario[index];
            const acertou = respostaUsuario === questao.resposta;
            
            if (acertou) acertos++;
            
            // Agrupar por disciplina
            if (!resultadoPorDisciplina[questao.disciplina]) {
                resultadoPorDisciplina[questao.disciplina] = { total: 0, acertos: 0 };
            }
            
            resultadoPorDisciplina[questao.disciplina].total++;
            if (acertou) resultadoPorDisciplina[questao.disciplina].acertos++;
        });
        
        return {
            totalQuestoes: simuladoAtual.length,
            acertos,
            erros: simuladoAtual.length - acertos,
            percentualAcertos: (acertos / simuladoAtual.length) * 100,
            tempoDecorrido,
            resultadoPorDisciplina
        };
    }

    function mostrarResultado(resultado) {
        // Dados gerais
        document.getElementById('percentual-acertos').textContent = `${resultado.percentualAcertos.toFixed(1)}%`;
        document.getElementById('total-acertos').textContent = resultado.acertos;
        document.getElementById('total-erros').textContent = resultado.erros;
        
        // Tempo
        const minutos = Math.floor(resultado.tempoDecorrido / 60).toString().padStart(2, '0');
        const segundos = (resultado.tempoDecorrido % 60).toString().padStart(2, '0');
        document.getElementById('tempo-total').textContent = `${minutos}:${segundos}`;
        
        // Resultado por disciplina
        const disciplinasContainer = document.getElementById('resultado-disciplinas');
        disciplinasContainer.innerHTML = '';
        
        for (const disciplina in resultado.resultadoPorDisciplina) {
            const { total, acertos } = resultado.resultadoPorDisciplina[disciplina];
            const percentual = (acertos / total) * 100;
            
            const disciplinaHTML = `
                <div class="disciplina-resultado">
                    <div class="disciplina-header">
                        <span class="disciplina-nome">${disciplina}</span>
                        <span class="disciplina-acertos">${acertos}/${total} acertos</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-value" style="width: ${percentual}%"></div>
                    </div>
                </div>
            `;
            
            disciplinasContainer.insertAdjacentHTML('beforeend', disciplinaHTML);
        }
    }

    function reiniciarSimulado() {
        // Resetar estado
        resultadoContainer.classList.add('hidden');
        filtrosContainer.classList.remove('hidden');
        
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function verCorrecao() {
        // Implementar visualização da correção
        alert('Funcionalidade de correção detalhada será implementada em breve!');
    }
});