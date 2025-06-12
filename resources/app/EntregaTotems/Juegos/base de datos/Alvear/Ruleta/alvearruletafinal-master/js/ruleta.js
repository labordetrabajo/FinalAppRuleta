
        const canvas = document.getElementById("ruleta");
        const ctx = canvas.getContext("2d");
        const girarBtn = document.getElementById("girarBtn");
        canvas.width = 480;
        canvas.height = 480;
        // se utiliza \u2006\u2006 para hacer espacios entre las letras
        const premios = [
            { nombre: "Pase\u2006\u2006VIP" },                 // índice 0 
            { nombre: "Entrada\u2006\u2006Gratis" },                      // índice 1 
            { nombre: "Llavero" },                           // índice 2 
            { nombre: "Degustación" },                     // índice 3 
            { nombre: "Pase\u2006\u2006VIP" },                        // índice 4 
            { nombre: "Entrada\u2006\u2006Gratis" },                        // índice 5 
            { nombre: "Llavero" },  // índice 6 
            { nombre: "Degustación" }  // índice 7 
        ];
        const colores = ["#ef8402", "#1a1a1a"];

       
        let animacionEnCurso = false;

        const numSectores = premios.length;
        const anguloSector = (2 * Math.PI) / numSectores;
        let anguloActual = 0;




        function dibujarRuleta() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < numSectores; i++) {
                const anguloInicio = i * anguloSector;
                const anguloFin = (i + 1) * anguloSector;
        
                // Dibujar sector
                ctx.beginPath();
                ctx.moveTo(240, 240);
                ctx.arc(240, 240, 240, anguloInicio, anguloFin);
                ctx.fillStyle = colores[i % colores.length];
                ctx.fill();
                ctx.stroke();
        
                // Dibujar texto
                ctx.save();
                ctx.translate(240, 240);
                ctx.rotate(anguloInicio + anguloSector / 2);
                ctx.fillStyle = "white";
                ctx.font = "bold 18px Arial";
                ctx.textAlign = "center";
        
                const texto = premios[i].nombre;
                const lineas = texto.split(" "); // logica para el espaciado de linea en la ruleta 
        
                if (lineas.length === 1) {
                    ctx.fillText(lineas[0], 160, 10); // Solo una palabra
                } else if (lineas.length === 2) {
                    ctx.fillText(lineas[0], 160, 0);   // Primera línea
                    ctx.fillText(lineas[1], 160, 20);  // Segunda línea
                } else {
                    // Para 3 o más palabras, en 3 líneas
                    ctx.fillText(lineas[0], 160, -10);
                    ctx.fillText(lineas[1], 160, 10);
                    ctx.fillText(lineas.slice(2).join(" "), 160, 30);
                }
                
        
                ctx.restore();
            }
        }
        

        function girarRuleta() {
            if (animacionEnCurso) return;  // Previene que se ejecute varias veces
            animacionEnCurso = true;
            document.getElementById("audioGiro").play();
        
            girarBtn.disabled = true; // Deshabilitar el botón mientras gira
        
            // Probabilidades actualizadas
            const probabilidades = [
                { indice: 0, probabilidad: 0.02 },  
                { indice: 1, probabilidad: 0.02 },  
                { indice: 2, probabilidad: 0.23 },  
                { indice: 3, probabilidad: 0.23 },  
                { indice: 4, probabilidad: 0.02 },  
                { indice: 5, probabilidad: 0.02 },  
                { indice: 6, probabilidad: 0.23 },   
                { indice: 7, probabilidad: 0.23 }   
            ];
        
            // Calcular el índice del premio basado en las probabilidades
            let totalProbabilidad = 0;
            let probabilidadAleatoria = Math.random();
        
            let indicePremioSeleccionado = 0;
            for (let i = 0; i < probabilidades.length; i++) {
                totalProbabilidad += probabilidades[i].probabilidad;
                if (probabilidadAleatoria <= totalProbabilidad) {
                    indicePremioSeleccionado = i;
                    break;
                }
            }
        
            // Usamos el índice seleccionado para determinar el premio y el ángulo
            const premioSeleccionado = premios[indicePremioSeleccionado].nombre;
            const anguloSector = 360 / numSectores;
            const anguloCentroSeleccionado = anguloSector * indicePremioSeleccionado + anguloSector / 2;
            const girosCompletos = 5; // Número de giros completos antes de detenerse
            const rotacionBase = 360 * girosCompletos; // Rotación base (múltiples giros completos)
        
            // Cálculo del ángulo final
            const anguloFinal = rotacionBase + (360 - anguloCentroSeleccionado);
        
            // Aplicamos la rotación
            anguloActual = anguloFinal;
            canvas.style.transition = "transform 3s ease-out";
            canvas.style.transform = `rotate(${anguloActual}deg)`;
        
            // Mostrar animación de los premios
            mostrarPremiosAnimados();
        
            setTimeout(() => {
                // Cálculo del premio final
                const anguloPremio = (360 - (anguloActual % 360)) % 360;
                const indicePremioFinal = Math.floor(anguloPremio / (360 / numSectores));
                const premioGanador = premios[indicePremioFinal].nombre;
        
                // Mostrar el premio final después de la animación
                mostrarResultado(premioGanador);
        
                // Reseteamos la transformación para permitir nuevos giros
                setTimeout(() => {
                    canvas.style.transition = "none";
                    canvas.style.transform = `rotate(${anguloActual % 360}deg)`;
                    girarBtn.disabled = false;
                    animacionEnCurso = false; // Vuelve a habilitar la animación
        
                    // Detener el audio
                    document.getElementById("audioGiro").pause();
                    document.getElementById("audioGiro").currentTime = 0;
                }, 100);
            }, 3000);
        }
        
        
        function mostrarPremiosAnimados() {
            const resultadoDiv = document.getElementById("resultado");
            let contador = 0;
            
            // Inicializamos la animación mostrando los premios rápidamente
            const intervalo = setInterval(() => {
                resultadoDiv.innerText = premios[contador % premios.length].nombre;
                contador++;
            }, 100);  // Cambiar el premio cada 100 ms (ajustar para velocidad)
        
            // Detener la animación después de unos segundos (cuando la ruleta termina de girar)
            setTimeout(() => {
                clearInterval(intervalo);
            }, 2500); // La animación dura 2.5 segundos
        }

        function animacionPorPremio(premio) {
         switch (premio) {
                case "Pase\u2006\u2006VIP":
                    lanzarConfeti("sorpresa");
                    new Audio("files/fiesta.mp3").play();
                    break;
                case "Pase\u2006\u2006VIP":
                    new Audio("files/fiesta.mp3").play();
                    lanzarConfeti("fiesta");
                    break;
                case "Llavero":
                    lanzarConfeti("pera");
                    new Audio("files/fiesta.mp3").play();
                    break;
                case "Llavero":
                    lanzarConfeti("pera");
                    new Audio("files/dance.mp3").play();
                    break;
                case "Degustación":
                    lanzarConfeti("poquito");
                    new Audio("files/alerta.mp3").play();
                    break;
                case "Degustación":
                    lanzarConfeti("poquito");
                    new Audio("files/alerta.mp3").play();
                    break;
                case "Entrada\u2006\u2006Gratis":
                    lanzarConfeti("poquito");
                    new Audio("files/alerta.mp3").play();
                    break;
                default:
                    lanzarConfeti("default");
                    break;
            }
        }
        
        

        function mostrarResultado(premio) {
            const resultadoEl = document.getElementById("resultado");
            resultadoEl.innerText = `🎉 ¡ ${premio} ! 🎉`;
        
            resultadoEl.classList.remove("animacion-ganador");
            void resultadoEl.offsetWidth;
            resultadoEl.classList.add("animacion-ganador");
        
            // 🎊 Lanzamos animación personalizada según premio
            animacionPorPremio(premio);
        }
        
        
function lanzarConfeti(tipo = "default") {
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const configs = {
        sorpresa: { startVelocity: 45, spread: 360, ticks: 80, colors: ['#FFD700', '#FF69B4', '#00FFFF'] },
        pera: { startVelocity: 20, spread: 180, ticks: 50, colors: ['#9B59B6'] },
        fiesta: { startVelocity: 60, spread: 360, ticks: 90, colors: ['#FF0000', '#00FF00', '#0000FF'] },
        poquito: { startVelocity: 0, spread: 0, ticks: 0, colors: ['#AAAAAA'] },
        default: { startVelocity: 30, spread: 360, ticks: 60 }
    };

    const confettiConfig = Object.assign({ zIndex: 999 }, configs[tipo]);

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 40 * (timeLeft / duration);
        confetti(Object.assign({}, confettiConfig, {
            particleCount,
            origin: { x: Math.random() * 0.5, y: Math.random() - 0.2 }
        }));
        confetti(Object.assign({}, confettiConfig, {
            particleCount,
            origin: { x: 1 - Math.random() * 0.5, y: Math.random() - 0.2 }
        }));
    }, 250);
}

        
        

        dibujarRuleta();

     
