
// Variables
let pokemon = [];
let selectedCards = [];
let matchedPairs = 0;
let clicks = 0;
let timer;
let timeLeft = 60;
let difficulty = 'medium';
let theme = 'light';
let powerUpUsed = false;

// Setup
document.addEventListener('DOMContentLoaded', async function() {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
    pokemon = response.data.results.map((poke, index) => ({
        name: poke.name,
        id: index + 1,
        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png`,
    }));

    document.getElementById('start').addEventListener('click', startGame);
    document.getElementById('reset').addEventListener('click', resetGame);
    document.getElementById('difficulty').addEventListener('change', (e) => {
        difficulty = e.target.value;
        resetGame();
    });
    document.getElementById('theme').addEventListener('click', toggleTheme);
    document.getElementById('power-up').addEventListener('click', activatePowerUp);
});

function startGame() {
    resetGame();
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft + 's';
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById('message').textContent = 'Game Over!';
        }
    }, 1000);
}

function resetGame() {
    clearInterval(timer);
    matchedPairs = 0;
    clicks = 0;
    powerUpUsed = false;
    timeLeft = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 45 : 30;
    document.getElementById('message').textContent = '';
    const grid = document.getElementById('pokemon');
    grid.innerHTML = '';
    const pairs = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    const shuffled = [...pokemon].sort(() => 0.5 - Math.random()).slice(0, pairs);
    const cards = [...shuffled, ...shuffled].sort(() => 0.5 - Math.random());

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;
        cardElement.innerHTML = `<div class='card-back'></div><div class='card-front'><img src="${card.img}" alt="${card.name}"/></div>`;
        grid.appendChild(cardElement);
        cardElement.addEventListener('click', function() {
            if (selectedCards.length >= 2 || cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) return;
            cardElement.classList.add('flipped');
            selectedCards.push(cardElement);
            clicks++;
            updateStats();

            if (selectedCards.length === 2) {
                setTimeout(() => {
                    if (selectedCards[0].dataset.name === selectedCards[1].dataset.name) {
                        selectedCards.forEach(card => card.classList.add('matched'));
                        matchedPairs++;
                        if (matchedPairs === pairs) {document.getElementById('pairs-left').textContent=0; document.getElementById('message').textContent = 'You Win!';     document.getElementById('matched').textContent = matchedPairs;
}
                    } else {
                        selectedCards.forEach(card => card.classList.remove('flipped'));
                    }
                    selectedCards = [];
                }, 500);
            }
        });
    });
    updateStats();
}

function activatePowerUp() {
    if (powerUpUsed) return;
    powerUpUsed = true;
    document.querySelectorAll('.card').forEach(card => card.classList.add('flipped'));
    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => {
            if (!card.classList.contains('matched')) card.classList.remove('flipped');
        });
    }, 3000);
}

function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    document.body.className = theme;
}

function updateStats() {
    document.getElementById('clicks').textContent = clicks;
    document.getElementById('matched').textContent = matchedPairs;
    document.getElementById('pairs-left').textContent = (difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8) - matchedPairs;
    document.getElementById('total-pairs').textContent = (difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8);
    document.getElementById('timer').textContent = timeLeft + 's';
}
