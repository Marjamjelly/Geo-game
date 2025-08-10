let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel') || 1);
if (document.getElementById('level-list')) {
  const container = document.getElementById('level-list');
  levels.forEach(lvl => {
    let btn = document.createElement('button');
    btn.textContent = lvl.name;
    btn.disabled = lvl.id > unlockedLevel;
    btn.onclick = () => {
      window.location = `quiz.html?level=${lvl.id}`;
    };
    container.appendChild(btn);
  });
}
if (document.getElementById('map-container')) {
  const params = new URLSearchParams(window.location.search);
  const levelId = parseInt(params.get('level'));
  const level = levels.find(l => l.id === levelId);
  if (!level) {
    document.body.innerHTML = "<h1>Level not found</h1>";
  } else {
    document.getElementById('level-title').textContent = level.name;
    let questionIndex = 0;
    let score = 0;
    function loadQuestion() {
      if (questionIndex >= level.questions.length) {
        document.getElementById('question').textContent = `Done! Score: ${score}`;
        document.getElementById('next-level').style.display = 'inline-block';
        if (level.id >= unlockedLevel) {
          unlockedLevel = level.id + 1;
          localStorage.setItem('unlockedLevel', unlockedLevel);
        }
        return;
      }
      document.getElementById('question').textContent =
        `Find: ${level.questions[questionIndex].toUpperCase()}`;
    }
    fetch(level.map)
      .then(r => r.text())
      .then(svgText => {
        document.getElementById('map-container').innerHTML = svgText;
        document.querySelectorAll('svg path').forEach(region => {
          region.addEventListener('click', () => {
            if (region.id.toLowerCase() === level.questions[questionIndex]) {
              region.style.fill = 'green';
              score++;
            } else {
              region.style.fill = 'red';
            }
            questionIndex++;
            loadQuestion();
            document.getElementById('score').textContent = `Score: ${score}`;
          });
        });
        loadQuestion();
      });
  }
}
function goNextLevel() {
  window.location = `quiz.html?level=${unlockedLevel}`;
}
