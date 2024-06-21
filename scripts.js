document.getElementById('lotteryForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o recarregamento da página
    const totalMoney = parseInt(document.getElementById('totalMoney').value);
    const results = calculateProbability(totalMoney);
    displayResults(results);
});


document.getElementById('generateNumbers').addEventListener('click', function() {
    const numToGenerate = parseInt(document.getElementById('numToGenerate').value);
    const numbers = generateRandomNumbers(numToGenerate);
    displayGeneratedNumbers(numbers);
});

const costs = {
    6: 5,
    7: 35,
    8: 140,
    9: 420,
    10: 1050,
    11: 2310,
    12: 4620,
    13: 8008,
    14: 13748,
    15: 22522.50
};

function calculateProbability(totalMoney) {
    let maxNumbers = 15;
    let results = [];

    for (let i = 6; i <= maxNumbers; i++) {
        let cost = costs[i];
        let numBets = Math.floor(totalMoney / cost);
        let probability = 1 / (getOdds(i) / numBets);
        let expectedReturn = probability * (totalMoney * 0.35);
        results.push({ numbers: i, bets: numBets, probability: probability, expectedReturn: expectedReturn, totalMoney: totalMoney });
    }

    results.sort((a, b) => b.expectedReturn - a.expectedReturn);

    return results;
}


function getOdds(numbers) {
    const odds = {
        6: 50063860,
        7: 7145060,
        8: 1783650,
        9: 595998,
        10: 238399,
        11: 108363,
        12: 54200,
        13: 29139,
        14: 16096,
        15: 9819
    };
    return odds[numbers];
}
function displayResults(results) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<h2>Probabilidade de Apostas:</h2>';
    resultDiv.innerHTML += '<p>Confira os resultados e mais informações no <a href="https://www.loteriasonline.caixa.gov.br/">site oficial da Caixa Econômica Federal</a>.</p>';

    // Encontrar e exibir a melhor escolha primeiro
    let bestChoice = results.find(result => result.bets > 0);
    if (bestChoice) {
        let explanation = '<span style="color: green; text-transform: uppercase;">MELHOR ESCOLHA!!</span>';
        let leftover = bestChoice.totalMoney - (bestChoice.bets * costs[bestChoice.numbers]);
        if (leftover > 0) {
            let bestExtraBet = calculateBestExtraBet(leftover);
            if (bestExtraBet.bets > 0) {
                explanation += ` Sobrou R$ ${leftover.toFixed(2)} após a aposta. Você pode fazer ${bestExtraBet.bets} apostas extras com ${bestExtraBet.numbers} números (Probabilidade: 1 em ${Math.round(1 / bestExtraBet.probability)})`;
            } else {
                explanation += ` Sobrou R$ ${leftover.toFixed(2)} após a aposta, mas não é suficiente para uma aposta extra.`;
            }
        }
        resultDiv.innerHTML += `<p><br>${explanation}<br> ${bestChoice.numbers} números: ${bestChoice.bets} apostas<br>Probabilidade: 1 em ${Math.round(1 / bestChoice.probability)}</p>`;
    }

    // Exibir o restante das apostas
    results.forEach((result, index) => {
        if (result.bets > 0 && result !== bestChoice) {
            let explanation = '';
            let leftover = result.totalMoney - (result.bets * costs[result.numbers]);
            if (leftover > 0) {
                let bestExtraBet = calculateBestExtraBet(leftover);
                if (bestExtraBet.bets > 0) {
                    explanation += ` Sobrou R$ ${leftover.toFixed(2)} após a aposta. Você pode fazer ${bestExtraBet.bets} apostas extras com ${bestExtraBet.numbers} números (Probabilidade: 1 em ${Math.round(1 / bestExtraBet.probability)})`;
                } else {
                    explanation += ` Sobrou R$ ${leftover.toFixed(2)} após a aposta, mas não é suficiente para uma aposta extra.`;
                }
            }
            resultDiv.innerHTML += `<p>${result.numbers} números: ${result.bets} apostas<br>Probabilidade: 1 em ${Math.round(1 / result.probability)}<br>${explanation}</p>`;
        }
    });
}





function calculateBestExtraBet(leftoverMoney) {
    let bestExtraBet = { numbers: 0, bets: 0, probability: 0 };

    for (let i = 6; i <= 15; i++) {
        let cost = costs[i];
        let numBets = Math.floor(leftoverMoney / cost);
        if (numBets > 0) {
            let probability = 1 / (getOdds(i) / numBets);
            if (probability > bestExtraBet.probability) {
                bestExtraBet = { numbers: i, bets: numBets, probability: probability };
            }
        }
    }

    return bestExtraBet;
}

function generateRandomNumbers(count) {
    let numbers = [];
    while (numbers.length < count) {
        let num = Math.floor(Math.random() * 60) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    return numbers;
}

function displayGeneratedNumbers(numbers) {
    const generatedDiv = document.getElementById('generatedNumbers');
    generatedDiv.innerHTML = `<p>Números gerados: ${numbers.join(', ')}</p>`;
}
