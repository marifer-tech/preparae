let currentArea = '';
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

document.addEventListener('DOMContentLoaded', () => {
  const area = localStorage.getItem('areaSelecionada');
  if (area) {
    startQuiz(area);
  }
});

function startQuiz(area) {
  currentArea = area;
  fetch(`${area}.json`)
    .then(response => response.json())
    .then(data => {
      currentQuestions = shuffleArray(data);
      currentQuestionIndex = 0;
      score = 0;
      userAnswers = [];

      document.getElementById('quiz-area').textContent = getAreaName(area);
      document.getElementById('quiz-progress').textContent = `Questão 1 de ${currentQuestions.length}`;
      document.getElementById('quiz-question').textContent = currentQuestions[0].texto;

      document.getElementById('quiz-section').style.display = 'block';
      document.getElementById('quiz-result').style.display = 'none';
      document.getElementById('quiz-question-feedback').style.display = 'none';
    })
    .catch(error => {
      alert("Erro ao carregar as questões.");
      console.error(error);
    });
}

function responder(resposta) {
  const isCorrect = resposta === currentQuestions[currentQuestionIndex].gabarito;
  
  // Armazena a resposta do usuário
  userAnswers.push({
    question: currentQuestions[currentQuestionIndex].texto,
    userAnswer: resposta,
    correctAnswer: currentQuestions[currentQuestionIndex].gabarito,
    isCorrect: isCorrect,
    explanation: currentQuestions[currentQuestionIndex].explicacao
  });

  // Mostra o feedback
  showQuestionFeedback(isCorrect);
}

function showQuestionFeedback(isCorrect) {
  // Esconde os botões de resposta
  document.querySelector('.quiz-options').style.display = 'none';
  
  // Configura o feedback
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackExplanation = document.getElementById('feedback-explanation');
  
  if (isCorrect) {
    feedbackTitle.textContent = 'Resposta Correta!';
    feedbackIcon.innerHTML = '✓';
    feedbackIcon.className = 'feedback-icon feedback-correct';
  } else {
    feedbackTitle.textContent = 'Resposta Incorreta';
    feedbackIcon.innerHTML = '✗';
    feedbackIcon.className = 'feedback-icon feedback-incorrect';
  }
  
  feedbackExplanation.textContent = currentQuestions[currentQuestionIndex].explicacao;
  
  // Mostra o feedback
  document.getElementById('quiz-question-feedback').style.display = 'block';
}

function nextQuestion() {
  // Verifica se acertou para incrementar o score
  if (userAnswers[currentQuestionIndex].isCorrect) {
    score++;
  }
  
  currentQuestionIndex++;
  
  if (currentQuestionIndex < currentQuestions.length) {
    // Prepara a próxima questão
    document.getElementById('quiz-progress').textContent = `Questão ${currentQuestionIndex + 1} de ${currentQuestions.length}`;
    document.getElementById('quiz-question').textContent = currentQuestions[currentQuestionIndex].texto;
    
    // Mostra os botões de resposta novamente
    document.querySelector('.quiz-options').style.display = 'flex';
    
    // Esconde o feedback
    document.getElementById('quiz-question-feedback').style.display = 'none';
  } else {
    showResult();
  }
}

function showResult() {
  const percent = Math.round((score / currentQuestions.length) * 100);
  let feedback = '';
  if (percent >= 80) feedback = 'Excelente! Domínio do conteúdo.';
  else if (percent >= 60) feedback = 'Bom! Continue estudando.';
  else if (percent >= 40) feedback = 'Regular. Reforce seus estudos.';
  else feedback = 'Fraco. Revise com mais atenção.';

  document.getElementById('quiz-question').style.display = 'none';
  document.getElementById('quiz-progress').style.display = 'none';
  document.querySelector('.quiz-options').style.display = 'none';
  document.getElementById('quiz-question-feedback').style.display = 'none';

  document.getElementById('quiz-score').textContent = `Você acertou ${score} de ${currentQuestions.length} (${percent}%)`;
  document.getElementById('quiz-feedback').textContent = feedback;
  document.getElementById('quiz-result').style.display = 'block';
}

// Funções auxiliares permanecem as mesmas
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getAreaName(area) {
  const map = {
    'disciplinas/basicos/portugues': 'Língua Portuguesa',
    'disciplinas/basicos/informatica': 'Informática',
    'disciplinas/basicos/etica': 'Ética',
    'disciplinas/basicos/logica': 'Lógica',
    'disciplinas/basicos/atualidades': 'Atualidades',
    'disciplinas/especificos/direitoadministrativo.json': 'Direito Administrativo',
    'disciplinas/especificos/direitoconstitucional.json': 'Direito Constitucional',
    'disciplinas/especificos/gestaocontratos.json': 'Gestão de Constratos',
    'disciplinas/especificos/gestaodepessoas.json': 'Gestão de Pessoas',
    'disciplinas/especificos/governanca.json': 'Governança',
    'disciplinas/especificos/legislacaopf.json': 'Legislação Aplicada à PF',
  };
  return map[area] || 'Área';
}

function setArea(area) {
  localStorage.setItem('areaSelecionada', area);
}