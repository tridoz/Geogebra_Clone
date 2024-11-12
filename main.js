var layout = {
    title: 'Grafico a Linee con Plotly',
    xaxis: { title: 'Asse X' },
    yaxis: { title: 'Asse Y' }
};

let minX = -10; // Limite iniziale minimo di X
let maxX = 10;  // Limite iniziale massimo di X
let previousMinX = minX; // Memorizza il valore precedente di minX
let previousMaxX = maxX; // Memorizza il valore precedente di maxX

function creaGrafico() {
    Plotly.newPlot('plotly-box', [], layout);

    // Listener per l'evento di pan/zoom
    document.getElementById('plotly-box').on('plotly_relayout', (eventData) => {
        const newMinX = eventData['xaxis.range[0]'];
        const newMaxX = eventData['xaxis.range[1]'];

        // Controlla se i limiti di X sono cambiati
        if (newMinX !== undefined && newMaxX !== undefined) {
            if (newMinX !== previousMinX || newMaxX !== previousMaxX) {
                minX = newMinX;
                maxX = newMaxX;
                previousMinX = minX; // Aggiorna il valore precedente di minX
                previousMaxX = maxX; // Aggiorna il valore precedente di maxX
                aggiornaGrafico(); // Aggiorna solo se i limiti sono cambiati
            }
        }
    });
}

function aggiornaGrafico() {
    const inputs = document.querySelectorAll(".equation-input");
    const traces = [];

    inputs.forEach((input, index) => {
        const equazione = input.value;
        let xValues = [];
        let yValues = [];

        if (equazione.trim()) {
            try {
                for (let x = minX; x <= maxX; x += 0.1) {
                    let y = math.evaluate(equazione, { x });
                    xValues.push(x);
                    yValues.push(y);
                }

                traces.push({
                    x: xValues,
                    y: yValues,
                    mode: 'lines',
                    type: 'scatter',
                    name: `Equazione ${index + 1}`
                });
            } catch (error) {
                console.error("Errore nel calcolo dell'equazione:", equazione, error);
            }
        }
    });

    Plotly.react('plotly-box', traces, layout);
}

document.getElementById("add-equation-button").addEventListener("click", () => {
    const nuovoInput = document.createElement("input");
    nuovoInput.type = "text";
    nuovoInput.className = "equation-input";
    nuovoInput.placeholder = "Es. sin(x) + cos(x)";
    document.getElementById("equation-inputs").appendChild(nuovoInput);
});

// Esegui `aggiornaGrafico` ogni 2 secondi
setInterval(aggiornaGrafico, 2000);
