/* =========================================================
   UNIVERSO ROMÁNTICO
   SCRIPT PRINCIPAL
========================================================= */


/* =========================================================
   ELEMENTOS
========================================================= */

const pantallaInicio =
    document.getElementById("pantalla-inicio");

const botonComenzar =
    document.getElementById("boton-comenzar");

const galaxiaPantalla =
    document.getElementById("galaxia-pantalla");

const canvasGalaxia =
    document.getElementById("galaxia");

const centroGalaxia =
    document.getElementById("centro-galaxia");

const frasesGalaxia =
    document.getElementById("frases-galaxia");

const frasesDOM =
    document.querySelectorAll(".frase-galaxia");

const estrellasExtra =
    document.getElementById("estrellas-extra");

const viajeLuz =
    document.getElementById("viaje-luz");

const pantallaBorrar =
    document.getElementById("pantalla-borrar");

const scratchCanvas =
    document.getElementById("scratch-canvas");

const pantallaPassword =
    document.getElementById("pantalla-password");

const contenido =
    document.getElementById("contenido");

const musica =
    document.getElementById("musica");

const controlMusica =
    document.getElementById("control-musica");

const codigo =
    document.getElementById("codigo");

const botonAbrir =
    document.getElementById("boton-abrir");

const errorPassword =
    document.getElementById("error-password");

const puntosCodigo =
    document.querySelectorAll(
        ".codigo-puntos span"
    );

const teAmos =
    document.getElementById("te-amos");

const corazones =
    document.getElementById("corazones");

const particulas =
    document.getElementById("particulas");



/* =========================================================
   CONFIGURACIÓN
========================================================= */

const CONTRASENA =
    "2803";

let musicaActiva = false;

let galaxiaIniciada = false;

let viajeIniciado = false;

let scratchInicializado = false;



/* =========================================================
   CONFIGURACIÓN DE GALAXIA
========================================================= */

const ctx =
    canvasGalaxia.getContext("2d");

let ancho =
    window.innerWidth;

let alto =
    window.innerHeight;

let centroX =
    ancho / 2;

let centroY =
    alto / 2;


/*
   Rotación principal del universo
*/

let rotacion =
    0;


/*
   Velocidad de inercia
*/

let velocidadRotacion =
    0;


/*
   Arrastre
*/

let arrastrando =
    false;

let ultimoAngulo =
    0;

let ultimoTiempo =
    0;


/*
   Movimiento vertical/horizontal
   tipo cámara VR
*/

let camaraX =
    0;

let camaraY =
    0;

let objetivoCamaraX =
    0;

let objetivoCamaraY =
    0;


/*
   Profundidad del universo
*/

let profundidadVR =
    0;


/*
   Tiempo de animación
*/

let tiempoUniverso =
    0;



/* =========================================================
   ESTRELLAS
========================================================= */

let estrellas = [];



/* =========================================================
   FRASES 3D
========================================================= */

let objetosFrases = [];



/* =========================================================
   MÚSICA
========================================================= */

function iniciarMusica() {

    if (!musica) {
        return;
    }

    musica.volume = 0.45;

    musica.play()
        .then(function () {

            musicaActiva =
                true;

            if (controlMusica) {

                controlMusica
                    .classList
                    .remove("pausado");

            }

        })
        .catch(function () {

            musicaActiva =
                false;

            if (controlMusica) {

                controlMusica
                    .classList
                    .add("pausado");

            }

        });

}



/* =========================================================
   NUEVO
   PANEL DE SELECCIÓN DE CANCIONES

   Al hacer click en "Comenzar" ya NO se entra directo
   a la galaxia. Primero se muestra un panel para elegir
   la canción. Cuando el usuario elige, se reproduce esa
   canción y a partir de ahí TODO sigue exactamente igual
   que antes (mismo iniciarGalaxia(), sin cambios).
========================================================= */

const panelCanciones =
    document.getElementById("panel-canciones");

const cancionPorDefecto =
    "campus fashion.mp3";

let cancionElegida =
    cancionPorDefecto;


function seleccionarCancion(src) {

    cancionElegida = src;

    if (musica) {

        const estabaSonando =
            !musica.paused;

        musica.src = src;

        if (estabaSonando || musicaActiva) {

            musica.play()
                .then(function () {

                    musicaActiva = true;

                    if (controlMusica) {

                        controlMusica
                            .classList
                            .remove("pausado");

                    }

                })
                .catch(function () {});

        }

    }


    document.querySelectorAll(".opcion-cancion")
        .forEach(function (boton) {

            boton.classList.toggle(
                "activa",
                boton.getAttribute("data-src") === src
            );

        });

}


document.querySelectorAll(
    "#panel-canciones .opcion-cancion"
).forEach(function (boton) {

    boton.addEventListener("click", function () {

        seleccionarCancion(
            boton.getAttribute("data-src")
        );


        if (panelCanciones) {

            panelCanciones
                .classList
                .remove("visible");

        }


        setTimeout(
            function () {

                galaxiaPantalla
                    .classList
                    .add("visible");

                iniciarGalaxia();

            },
            700
        );

    });

});


/* =========================================================
   BOTÓN COMENZAR
========================================================= */

if (botonComenzar) {

    botonComenzar.addEventListener(
        "click",
        function () {

            if (musica) {

                musica.src =
                    cancionElegida;

            }

            iniciarMusica();

            pantallaInicio
                .classList
                .add("oculta");


            setTimeout(
                function () {

                    if (panelCanciones) {

                        panelCanciones
                            .classList
                            .add("visible");

                    } else {

                        galaxiaPantalla
                            .classList
                            .add("visible");

                        iniciarGalaxia();

                    }

                },
                900
            );

        }
    );

}



/* =========================================================
   CONTROL DE MÚSICA
========================================================= */

if (controlMusica) {

    controlMusica.addEventListener(
        "click",
        function () {

            if (!musica) {
                return;
            }


            if (musica.paused) {

                musica.play()
                    .then(function () {

                        musicaActiva =
                            true;

                        controlMusica
                            .classList
                            .remove("pausado");

                    })
                    .catch(function () {

                        musicaActiva =
                            false;

                    });

            } else {

                musica.pause();

                musicaActiva =
                    false;

                controlMusica
                    .classList
                    .add("pausado");

            }

        }
    );

}



/* =========================================================
   REDIMENSIONAR CANVAS
========================================================= */

function ajustarCanvas() {

    ancho =
        window.innerWidth;

    alto =
        window.innerHeight;


    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    canvasGalaxia.width =
        ancho * dpr;

    canvasGalaxia.height =
        alto * dpr;


    canvasGalaxia.style.width =
        ancho + "px";

    canvasGalaxia.style.height =
        alto + "px";


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    centroX =
        ancho / 2;

    centroY =
        alto / 2;


    crearEstrellas();

    crearObjetosFrases();

}



/* =========================================================
   EVENTO RESIZE
========================================================= */

window.addEventListener(
    "resize",
    function () {

        ajustarCanvas();

    }
);



/* =========================================================
   CREAR ESTRELLAS
========================================================= */

function crearEstrellas() {

    estrellas = [];


    const cantidad =
        Math.min(
            1200,
            Math.floor(
                (
                    ancho *
                    alto
                ) / 650
            )
        );


    for (
        let i = 0;
        i < cantidad;
        i++
    ) {

        const distancia =
            Math.pow(
                Math.random(),
                0.58
            ) *
            Math.max(
                ancho,
                alto
            ) *
            0.82;


        estrellas.push({

            distancia:
                distancia,

            angulo:
                Math.random() *
                Math.PI *
                2,

            profundidad:
                Math.random(),

            tamano:
                Math.random() *
                1.8 +
                0.25,

            brillo:
                Math.random() *
                0.75 +
                0.25,

            color:
                Math.random() > 0.86
                    ? "#ffd5ec"
                    : "#ffffff"

        });

    }

}



/* =========================================================
   CREAR OBJETOS 3D PARA LAS FRASES
========================================================= */

function crearObjetosFrases() {

    objetosFrases = [];


    if (!frasesDOM.length) {
        return;
    }


    const radioMaximo =
        Math.min(
            ancho,
            alto
        ) *
        (
            ancho < 600
                ? 0.67
                : 0.57
        );


    frasesDOM.forEach(
        function (elemento, indice) {

            /*
               Distribución alrededor de la galaxia
            */

            const anguloBase =
                (
                    indice /
                    frasesDOM.length
                ) *
                Math.PI *
                2;


            /*
               Variación para evitar
               que queden demasiado perfectas
            */

            const angulo =
                anguloBase +
                (
                    Math.random() -
                    0.5
                ) *
                0.55;


            const radio =
                125 +
                Math.pow(
                    Math.random(),
                    0.72
                ) *
                (
                    radioMaximo -
                    125
                );


            /*
               Profundidad real
            */

            const profundidad =
                Math.random() *
                2 -
                1;


            objetosFrases.push({

                elemento:
                    elemento,

                angulo:
                    angulo,

                radio:
                    radio,

                profundidad:
                    profundidad,

                velocidad:
                    (
                        Math.random() *
                        0.10 +
                        0.025
                    ) *
                    (
                        Math.random() >
                        0.5
                            ? 1
                            : -1
                    ),

                inclinacion:
                    Math.random() *
                    14 -
                    7,

                fase:
                    Math.random() *
                    Math.PI *
                    2

            });


            /*
               Preparar elementos
            */

            elemento.style.position =
                "absolute";

            elemento.style.left =
                "50%";

            elemento.style.top =
                "50%";

            elemento.style.willChange =
                "transform, opacity, filter";

        }
    );

}



/* =========================================================
   POSICIÓN DE ESTRELLA
========================================================= */

function posicionEstrella(
    estrella
) {

    const profundidad =
        (
            estrella.profundidad -
            0.5
        ) *
        2;


    const angulo =
        estrella.angulo +
        rotacion *
        (
            0.55 +
            estrella.profundidad *
            0.85
        );


    const radio =
        estrella.distancia *
        (
            1 +
            camaraY *
            profundidad *
            0.08
        );


    return {

        x:
            centroX +
            Math.cos(
                angulo
            ) *
            radio +
            camaraX *
            profundidad *
            0.35,

        y:
            centroY +
            Math.sin(
                angulo
            ) *
            radio *
            0.58 +
            camaraY *
            profundidad *
            0.35

    };

}



/* =========================================================
   DIBUJAR ESTRELLAS
========================================================= */

function dibujarEstrellas() {

    const ahora =
        performance.now();


    for (
        let i = 0;
        i < estrellas.length;
        i++
    ) {

        const estrella =
            estrellas[i];


        const posicion =
            posicionEstrella(
                estrella
            );


        const x =
            posicion.x;

        const y =
            posicion.y;


        if (
            x < -30 ||
            x > ancho + 30 ||
            y < -30 ||
            y > alto + 30
        ) {

            continue;

        }


        /*
           Parpadeo
        */

        const brillo =
            estrella.brillo *
            (
                0.72 +
                Math.sin(
                    ahora *
                    0.0018 +
                    i
                ) *
                0.28
            );


        ctx.globalAlpha =
            brillo;

        ctx.fillStyle =
            estrella.color;


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            estrella.tamano,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
           Estrellas grandes
        */

        if (
            estrella.tamano >
            1.65
        ) {

            ctx.globalAlpha =
                brillo *
                0.55;

            ctx.strokeStyle =
                "#ffffff";

            ctx.lineWidth =
                0.45;


            ctx.beginPath();

            ctx.moveTo(
                x - 4,
                y
            );

            ctx.lineTo(
                x + 4,
                y
            );


            ctx.moveTo(
                x,
                y - 4
            );

            ctx.lineTo(
                x,
                y + 4
            );

            ctx.stroke();

        }

    }


    ctx.globalAlpha =
        1;

}



/* =========================================================
   NUBE GALÁCTICA
========================================================= */

function dibujarBrazosGalaxia() {

    const radioMax =
        Math.min(
            ancho,
            alto
        ) *
        0.48;


    /*
       GRAN NUBE MORADA
    */

    for (
        let brazo = 0;
        brazo < 5;
        brazo++
    ) {

        ctx.beginPath();


        for (
            let r = 15;
            r < radioMax;
            r += 3
        ) {

            const angulo =
                brazo *
                (
                    Math.PI *
                    2 /
                    5
                ) +
                r *
                0.015 +
                rotacion;


            const profundidad =
                Math.sin(
                    r *
                    0.012 +
                    brazo
                );


            const x =
                centroX +
                Math.cos(
                    angulo
                ) *
                r +
                camaraX *
                profundidad *
                0.12;


            const y =
                centroY +
                Math.sin(
                    angulo
                ) *
                r *
                0.54 +
                camaraY *
                profundidad *
                0.10;


            if (
                r === 15
            ) {

                ctx.moveTo(
                    x,
                    y
                );

            } else {

                ctx.lineTo(
                    x,
                    y
                );

            }

        }


        const gradiente =
            ctx.createLinearGradient(
                centroX -
                radioMax,
                centroY,
                centroX +
                radioMax,
                centroY
            );


        gradiente.addColorStop(
            0,
            "rgba(80,10,180,.01)"
        );

        gradiente.addColorStop(
            0.25,
            "rgba(100,15,225,.22)"
        );

        gradiente.addColorStop(
            0.48,
            "rgba(235,30,205,.58)"
        );

        gradiente.addColorStop(
            0.65,
            "rgba(125,20,235,.32)"
        );

        gradiente.addColorStop(
            1,
            "rgba(40,5,100,.01)"
        );


        ctx.strokeStyle =
            gradiente;

        ctx.lineWidth =
            27;

        ctx.lineCap =
            "round";

        ctx.shadowBlur =
            38;

        ctx.shadowColor =
            "rgba(160,20,255,.78)";

        ctx.globalAlpha =
            0.32;


        ctx.stroke();

    }


    /*
       BRAZOS FINOS
    */

    ctx.shadowBlur =
        0;


    for (
        let brazo = 0;
        brazo < 6;
        brazo++
    ) {

        ctx.beginPath();


        for (
            let r = 20;
            r < radioMax * 0.94;
            r += 2.3
        ) {

            const angulo =
                brazo *
                (
                    Math.PI *
                    2 /
                    6
                ) +
                r *
                0.017 +
                rotacion;


            const x =
                centroX +
                Math.cos(
                    angulo
                ) *
                r;


            const y =
                centroY +
                Math.sin(
                    angulo
                ) *
                r *
                0.56;


            if (
                r === 20
            ) {

                ctx.moveTo(
                    x,
                    y
                );

            } else {

                ctx.lineTo(
                    x,
                    y
                );

            }

        }


        ctx.strokeStyle =
            "rgba(255,55,215,.25)";

        ctx.lineWidth =
            1.5;

        ctx.globalAlpha =
            0.62;

        ctx.stroke();

    }


    ctx.globalAlpha =
        1;

}



/* =========================================================
   NÚCLEO DE LA GALAXIA
========================================================= */

function dibujarNucleo() {

    const radio =
        Math.min(
            ancho,
            alto
        ) *
        0.27;


    /*
       GRAN RESPLANDOR
    */

    const nucleo =
        ctx.createRadialGradient(
            centroX,
            centroY,
            0,
            centroX,
            centroY,
            radio
        );


    nucleo.addColorStop(
        0,
        "rgba(255,255,255,.98)"
    );

    nucleo.addColorStop(
        0.025,
        "rgba(255,228,248,.98)"
    );

    nucleo.addColorStop(
        0.065,
        "rgba(255,80,215,.92)"
    );

    nucleo.addColorStop(
        0.18,
        "rgba(165,25,205,.58)"
    );

    nucleo.addColorStop(
        0.45,
        "rgba(80,12,130,.20)"
    );

    nucleo.addColorStop(
        1,
        "transparent"
    );


    ctx.fillStyle =
        nucleo;


    ctx.beginPath();

    ctx.arc(
        centroX,
        centroY,
        radio,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       ANILLOS DEL PORTAL
    */

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const pulso =
            Math.sin(
                tiempoUniverso *
                0.002 +
                i
            ) *
            2;


        ctx.beginPath();


        ctx.ellipse(
            centroX +
            camaraX *
            0.04,

            centroY +
            camaraY *
            0.04,

            18 +
            i * 8 +
            pulso,

            7 +
            i * 2.8 +
            pulso * 0.3,

            rotacion +
            i *
            0.21,

            0,
            Math.PI * 2
        );


        ctx.strokeStyle =
            `rgba(255,${95 + i * 14},${218 + i * 5},${0.72 - i * 0.075})`;

        ctx.lineWidth =
            i === 0
                ? 2.8
                : 1.2;


        ctx.shadowBlur =
            i === 0
                ? 12
                : 5;

        ctx.shadowColor =
            "#ff43d2";


        ctx.stroke();

    }


    ctx.shadowBlur =
        0;

}



/* =========================================================
   ACTUALIZAR FRASES 3D
========================================================= */

function actualizarFrases3D() {

    if (
        !objetosFrases.length
    ) {

        return;

    }


    const ahora =
        performance.now();


    objetosFrases.forEach(
        function (
            objeto,
            indice
        ) {

            const elemento =
                objeto.elemento;


            /*
               Movimiento orbital
            */

            const angulo =
                objeto.angulo +
                rotacion *
                (
                    0.55 +
                    objeto.profundidad *
                    0.28
                ) +
                (
                    ahora *
                    0.000035 *
                    objeto.velocidad
                );


            /*
               Profundidad simulada
            */

            const profundidadOrbita =
                Math.sin(
                    angulo
                );


            /*
               Movimiento vertical suave
            */

            const flotacion =
                Math.sin(
                    ahora *
                    0.00065 +
                    objeto.fase
                ) *
                8;


            /*
               Posición elíptica
            */

            const radioX =
                objeto.radio *
                (
                    1 +
                    camaraX *
                    0.0007 *
                    objeto.profundidad
                );


            const radioY =
                objeto.radio *
                0.56;


            const x =
                Math.cos(
                    angulo
                ) *
                radioX;


            const y =
                Math.sin(
                    angulo
                ) *
                radioY +
                flotacion;


            /*
               Profundidad:

               delante =
               más grande/brillante

               atrás =
               más pequeño/transparente
            */

            const profundidad =
                (
                    Math.sin(
                        angulo
                    ) *
                    0.5
                ) +
                0.5;


            const escala =
                0.68 +
                profundidad *
                0.55;


            const opacidad =
                0.24 +
                profundidad *
                0.68;


            /*
               Movimiento VR adicional
            */

            const desplazamientoX =
                camaraX *
                (
                    0.08 +
                    profundidad *
                    0.16
                );


            const desplazamientoY =
                camaraY *
                (
                    0.06 +
                    profundidad *
                    0.13
                );


            /*
               Rotación ligera
            */

            const inclinacion =
                objeto.inclinacion +
                Math.sin(
                    ahora *
                    0.0005 +
                    indice
                ) *
                3;


            /*
               Blur para profundidad
            */

            const blur =
                profundidad < 0.20
                    ? 1.4
                    : 0;


            /*
               Transformación 3D
            */

            elemento.style.transform =
                `
                translate3d(
                    calc(-50% + ${x + desplazamientoX}px),
                    calc(-50% + ${y + desplazamientoY}px),
                    ${profundidad * 160}px
                )
                scale(${escala})
                rotate(${inclinacion}deg)
                `;


            elemento.style.opacity =
                opacidad;


            elemento.style.filter =
                `
                blur(${blur}px)
                drop-shadow(
                    0 0 ${4 + profundidad * 8}px
                    rgba(230,25,130,.45)
                )
                `;


            /*
               Z-index dinámico
            */

            elemento.style.zIndex =
                Math.floor(
                    profundidad *
                    100
                );

        }
    );

}



/* =========================================================
   ACTUALIZAR CÁMARA VR
========================================================= */

function actualizarCamara() {

    /*
       Suavizado
    */

    camaraX +=
        (
            objetivoCamaraX -
            camaraX
        ) *
        0.065;


    camaraY +=
        (
            objetivoCamaraY -
            camaraY
        ) *
        0.065;


    /*
       Perspectiva del contenedor
    */

    if (galaxiaPantalla) {

        galaxiaPantalla.style.setProperty(
            "--camara-x",
            `${camaraX * 0.015}deg`
        );

        galaxiaPantalla.style.setProperty(
            "--camara-y",
            `${camaraY * -0.015}deg`
        );

    }

}



/* =========================================================
   MOVIMIENTO DE CÁMARA CON MOUSE
========================================================= */

window.addEventListener(
    "pointermove",
    function (e) {

        if (
            !galaxiaPantalla ||
            !galaxiaPantalla.classList.contains(
                "visible"
            )
        ) {

            return;

        }


        /*
           Si estamos arrastrando,
           el movimiento del dedo controla
           principalmente la rotación.
        */

        if (
            arrastrando
        ) {

            return;

        }


        const porcentajeX =
            (
                e.clientX /
                ancho
            ) -
            0.5;


        const porcentajeY =
            (
                e.clientY /
                alto
            ) -
            0.5;


        objetivoCamaraX =
            porcentajeX *
            100;


        objetivoCamaraY =
            porcentajeY *
            80;

    }
);



/* =========================================================
   MOVIMIENTO VR EN MÓVIL
========================================================= */

window.addEventListener(
    "deviceorientation",
    function (e) {

        if (
            !galaxiaPantalla ||
            !galaxiaPantalla.classList.contains(
                "visible"
            )
        ) {

            return;

        }


        if (
            e.gamma !== null
        ) {

            objetivoCamaraX =
                Math.max(
                    -50,
                    Math.min(
                        50,
                        e.gamma *
                        1.8
                    )
                );

        }


        if (
            e.beta !== null
        ) {

            objetivoCamaraY =
                Math.max(
                    -45,
                    Math.min(
                        45,
                        (
                            e.beta -
                            45
                        ) *
                        1.2
                    )
                );

        }

    },
    true
);



/* =========================================================
   DIBUJAR UNIVERSO
========================================================= */

function dibujarGalaxia() {

    tiempoUniverso =
        performance.now();


    /*
       Limpiar
    */

    ctx.clearRect(
        0,
        0,
        ancho,
        alto
    );


    /*
       Fondo espacial
    */

    const fondo =
        ctx.createRadialGradient(
            centroX,
            centroY,
            0,
            centroX,
            centroY,
            Math.max(
                ancho,
                alto
            ) *
            0.85
        );


    fondo.addColorStop(
        0,
        "#190019"
    );

    fondo.addColorStop(
        0.22,
        "#0c0010"
    );

    fondo.addColorStop(
        0.55,
        "#030008"
    );

    fondo.addColorStop(
        1,
        "#000000"
    );


    ctx.fillStyle =
        fondo;


    ctx.fillRect(
        0,
        0,
        ancho,
        alto
    );


    /*
       Estrellas
    */

    dibujarEstrellas();


    /*
       Galaxia
    */

    dibujarBrazosGalaxia();


    /*
       Núcleo
    */

    dibujarNucleo();


    /*
       Frases HTML
    */

    actualizarFrases3D();


    /*
       Cámara
    */

    actualizarCamara();


    requestAnimationFrame(
        dibujarGalaxia
    );

}



/* =========================================================
   INICIAR GALAXIA
========================================================= */

function iniciarGalaxia() {

    if (
        galaxiaIniciada
    ) {

        return;

    }


    galaxiaIniciada =
        true;


    ajustarCanvas();

    crearEstrellas();

    crearObjetosFrases();


    /*
       Perspectiva inicial
    */

    if (frasesGalaxia) {

        frasesGalaxia.style.perspective =
            "900px";

        frasesGalaxia.style.transformStyle =
            "preserve-3d";

    }


    /*
       Canvas
    */

    dibujarGalaxia();

}



/* =========================================================
   OBTENER ÁNGULO DEL PUNTERO
========================================================= */

function obtenerAngulo(
    x,
    y
) {

    return Math.atan2(
        y - centroY,
        x - centroX
    );

}



/* =========================================================
   DIFERENCIA DE ÁNGULOS
========================================================= */

function diferenciaAngulos(
    actual,
    anterior
) {

    let diferencia =
        actual -
        anterior;


    if (
        diferencia >
        Math.PI
    ) {

        diferencia -=
            Math.PI * 2;

    }


    if (
        diferencia <
        -Math.PI
    ) {

        diferencia +=
            Math.PI * 2;

    }


    return diferencia;

}



/* =========================================================
   ARRASTRAR UNIVERSO
========================================================= */

canvasGalaxia.addEventListener(
    "pointerdown",
    function (e) {

        /*
           No iniciar si ya estamos
           entrando al portal.
        */

        if (
            viajeIniciado
        ) {

            return;

        }


        arrastrando =
            true;


        ultimoAngulo =
            obtenerAngulo(
                e.clientX,
                e.clientY
            );


        ultimoTiempo =
            performance.now();


        /*
           Capturar dedo/mouse
        */

        try {

            canvasGalaxia.setPointerCapture(
                e.pointerId
            );

        } catch (error) {}

    }
);



/* =========================================================
   MOVER UNIVERSO
========================================================= */

canvasGalaxia.addEventListener(
    "pointermove",
    function (e) {

        if (
            !arrastrando
        ) {

            return;

        }


        const nuevoAngulo =
            obtenerAngulo(
                e.clientX,
                e.clientY
            );


        const diferencia =
            diferenciaAngulos(
                nuevoAngulo,
                ultimoAngulo
            );


        const distancia =
            Math.hypot(
                e.clientX -
                centroX,

                e.clientY -
                centroY
            );


        /*
           Si el dedo está suficientemente
           lejos del centro, giramos.
        */

        if (
            distancia >
            20
        ) {

            rotacion +=
                diferencia;

        }


        /*
           Inercia
        */

        const ahora =
            performance.now();


        const deltaTiempo =
            Math.max(
                8,
                ahora -
                ultimoTiempo
            );


        velocidadRotacion =
            diferencia /
            deltaTiempo *
            16;


        /*
           Cámara ligeramente
           inclinada con el movimiento
        */

        objetivoCamaraX =
            (
                e.clientX -
                ancho / 2
            ) *
            0.08;


        objetivoCamaraY =
            (
                e.clientY -
                alto / 2
            ) *
            0.06;


        ultimoAngulo =
            nuevoAngulo;


        ultimoTiempo =
            ahora;

    }
);



/* =========================================================
   SOLTAR UNIVERSO
========================================================= */

canvasGalaxia.addEventListener(
    "pointerup",
    function () {

        arrastrando =
            false;

    }
);


canvasGalaxia.addEventListener(
    "pointercancel",
    function () {

        arrastrando =
            false;

    }
);


canvasGalaxia.addEventListener(
    "pointerleave",
    function () {

        /*
           En mouse dejamos que la inercia
           continúe aunque salga del canvas.
        */

        if (
            window.matchMedia(
                "(pointer: fine)"
            ).matches
        ) {

            arrastrando =
                false;

        }

    }
);



/* =========================================================
   INERCIA
========================================================= */

function actualizarInercia() {

    if (
        !arrastrando &&
        !viajeIniciado
    ) {

        rotacion +=
            velocidadRotacion;


        velocidadRotacion *=
            0.94;


        if (
            Math.abs(
                velocidadRotacion
            ) <
            0.00005
        ) {

            velocidadRotacion =
                0;

        }

    }


    requestAnimationFrame(
        actualizarInercia
    );

}


actualizarInercia();



/* =========================================================
   PORTAL CENTRAL
========================================================= */

let portalActivado =
    false;



/*
   La interacción ahora ocurre
   directamente sobre el corazón.

   Primero activa el portal,
   luego hace zoom al universo,
   y finalmente inicia el viaje.
*/

if (centroGalaxia) {

    centroGalaxia.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            e.stopPropagation();


            activarPortal();

        }
    );

}



/* =========================================================
   ACTIVAR PORTAL
========================================================= */

function activarPortal() {

    if (
        portalActivado ||
        viajeIniciado
    ) {

        return;

    }


    portalActivado =
        true;


    /*
       Clase para CSS
    */

    galaxiaPantalla
        .classList
        .add(
            "portal-activado"
        );


    centroGalaxia
        .classList
        .add(
            "activo"
        );


    /*
       Frenar rotación
    */

    velocidadRotacion =
        0;


    /*
       Expandir profundidad
    */

    profundidadVR =
        1;


    /*
       Efecto de zoom progresivo
    */

    let progreso =
        0;


    const duracion =
        1700;


    const inicio =
        performance.now();


    function zoomPortal(
        ahora
    ) {

        progreso =
            Math.min(
                1,
                (
                    ahora -
                    inicio
                ) /
                duracion
            );


        /*
           Easing
        */

        const ease =
            1 -
            Math.pow(
                1 -
                progreso,
                4
            );


        /*
           Acercamos la galaxia
        */

        const escala =
            1 +
            ease *
            3.5;


        /*
           Rotación acelerada
        */

        rotacion +=
            0.012 *
            ease;


        /*
           Cámara entra al centro
        */

        camaraX *=
            0.96;

        camaraY *=
            0.96;


        /*
           Aplicar zoom al universo
        */

        galaxiaPantalla.style.setProperty(
            "--portal-scale",
            escala
        );


        galaxiaPantalla.style.setProperty(
            "--portal-progress",
            progreso
        );


        /*
           Intensidad del núcleo
        */

        centroGalaxia.style.setProperty(
            "--portal-intensidad",
            1 +
            ease *
            2
        );


        if (
            progreso <
            1
        ) {

            requestAnimationFrame(
                zoomPortal
            );

        }

    }


    requestAnimationFrame(
        zoomPortal
    );


    /*
       Después del zoom:
       viaje a través del portal
    */

    setTimeout(
        function () {

            comenzarViaje();

        },
        1750
    );

}



/* =========================================================
   VIAJE A VELOCIDAD DE LA LUZ
========================================================= */

function comenzarViaje() {

    if (
        viajeIniciado
    ) {

        return;

    }


    viajeIniciado =
        true;


    /*
       Activar viaje
    */

    viajeLuz
        .classList
        .add(
            "activo"
        );


    /*
       Ocultar galaxia
    */

    galaxiaPantalla
        .classList
        .remove(
            "visible"
        );


    /*
       Limpiar estado portal
    */

    galaxiaPantalla
        .classList
        .remove(
            "portal-activado"
        );


    /*
       Después del túnel
    */

    setTimeout(
        function () {

            mostrarPanelBorrar();

        },
        2100
    );

}



/* =========================================================
   PANEL BORRAR
========================================================= */

function mostrarPanelBorrar() {

    viajeLuz
        .classList
        .remove(
            "activo"
        );


    pantallaBorrar
        .classList
        .add(
            "visible"
        );


    inicializarScratch();

}



/* =========================================================
   SISTEMA SCRATCH
========================================================= */

let scratchCtx;

let borrando =
    false;

let porcentajeBorrado =
    0;

let ultimaComprobacion =
    0;



/* =========================================================
   INICIALIZAR SCRATCH
========================================================= */

function inicializarScratch() {

    if (
        scratchInicializado
    ) {

        return;

    }


    if (
        !scratchCanvas
    ) {

        return;

    }


    scratchInicializado =
        true;


    const rect =
        scratchCanvas
            .getBoundingClientRect();


    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    scratchCanvas.width =
        rect.width *
        dpr;


    scratchCanvas.height =
        rect.height *
        dpr;


    scratchCtx =
        scratchCanvas.getContext(
            "2d"
        );


    scratchCtx.scale(
        dpr,
        dpr
    );


    /*
       Fondo
    */

    const gradiente =
        scratchCtx.createLinearGradient(
            0,
            0,
            rect.width,
            rect.height
        );


    gradiente.addColorStop(
        0,
        "#8a2948"
    );

    gradiente.addColorStop(
        0.5,
        "#64132f"
    );

    gradiente.addColorStop(
        1,
        "#420b20"
    );


    scratchCtx.fillStyle =
        gradiente;


    scratchCtx.fillRect(
        0,
        0,
        rect.width,
        rect.height
    );


    /*
       Pequeñas partículas
    */

    for (
        let i = 0;
        i < 70;
        i++
    ) {

        const x =
            Math.random() *
            rect.width;

        const y =
            Math.random() *
            rect.height;

        const radio =
            Math.random() *
            1.8 +
            0.4;


        scratchCtx.globalAlpha =
            Math.random() *
            0.5 +
            0.2;


        scratchCtx.fillStyle =
            "#efc6b7";


        scratchCtx.beginPath();


        scratchCtx.arc(
            x,
            y,
            radio,
            0,
            Math.PI * 2
        );


        scratchCtx.fill();

    }


    scratchCtx.globalAlpha =
        1;


    /*
       Texto superior
    */

    scratchCtx.fillStyle =
        "rgba(255,225,215,.8)";


    scratchCtx.font =
        "500 12px Montserrat";


    scratchCtx.textAlign =
        "center";


    scratchCtx.fillText(
        "DESLIZA PARA DESCUBRIR",
        rect.width / 2,
        34
    );

}



/* =========================================================
   POSICIÓN SCRATCH
========================================================= */

function obtenerPosicionScratch(e) {

    const rect =
        scratchCanvas
            .getBoundingClientRect();


    return {

        x:
            e.clientX -
            rect.left,

        y:
            e.clientY -
            rect.top

    };

}



/* =========================================================
   BORRAR
========================================================= */

function borrarEn(
    x,
    y
) {

    if (
        !scratchCtx
    ) {

        return;

    }


    scratchCtx.save();


    scratchCtx.globalCompositeOperation =
        "destination-out";


    scratchCtx.beginPath();


    scratchCtx.arc(
        x,
        y,
        32,
        0,
        Math.PI * 2
    );


    scratchCtx.fill();


    scratchCtx.restore();

}



/* =========================================================
   SCRATCH POINTER DOWN
========================================================= */

if (scratchCanvas) {

    scratchCanvas.addEventListener(
        "pointerdown",
        function (e) {

            borrando =
                true;


            try {

                scratchCanvas.setPointerCapture(
                    e.pointerId
                );

            } catch (error) {}


            const posicion =
                obtenerPosicionScratch(
                    e
                );


            borrarEn(
                posicion.x,
                posicion.y
            );

        }
    );


    scratchCanvas.addEventListener(
        "pointermove",
        function (e) {

            if (
                !borrando
            ) {

                return;

            }


            const posicion =
                obtenerPosicionScratch(
                    e
                );


            borrarEn(
                posicion.x,
                posicion.y
            );

        }
    );


    scratchCanvas.addEventListener(
        "pointerup",
        function () {

            borrando =
                false;


            comprobarBorrado();

        }
    );


    scratchCanvas.addEventListener(
        "pointercancel",
        function () {

            borrando =
                false;

        }
    );

}



/* =========================================================
   COMPROBAR BORRADO
========================================================= */

function comprobarBorrado() {

    if (
        !scratchCtx
    ) {

        return;

    }


    const ahora =
        Date.now();


    if (
        ahora -
        ultimaComprobacion <
        500
    ) {

        return;

    }


    ultimaComprobacion =
        ahora;


    const imagen =
        scratchCtx.getImageData(
            0,
            0,
            scratchCanvas.width,
            scratchCanvas.height
        );


    let transparentes =
        0;


    const paso =
        16;


    for (
        let i = 3;
        i < imagen.data.length;
        i += 4 * paso
    ) {

        if (
            imagen.data[i] <
            40
        ) {

            transparentes++;

        }

    }


    const total =
        imagen.data.length /
        (
            4 *
            paso
        );


    porcentajeBorrado =
        transparentes /
        total;


    /*
       Cuando se descubre suficiente
    */

    if (
        porcentajeBorrado >
        0.52
    ) {

        revelarPassword();

    }

}



/* =========================================================
   REVELAR PASSWORD
========================================================= */

function revelarPassword() {

    pantallaBorrar
        .classList
        .remove(
            "visible"
        );


    setTimeout(
        function () {

            pantallaPassword
                .classList
                .add(
                    "visible"
                );


            if (codigo) {

                codigo.focus();

            }

        },
        500
    );

}



/* =========================================================
   PASSWORD
========================================================= */

if (codigo) {

    codigo.addEventListener(
        "input",
        function () {

            const valor =
                codigo.value;


            for (
                let i = 0;
                i < puntosCodigo.length;
                i++
            ) {

                if (
                    i <
                    valor.length
                ) {

                    puntosCodigo[i]
                        .classList
                        .add(
                            "activo"
                        );

                } else {

                    puntosCodigo[i]
                        .classList
                        .remove(
                            "activo"
                        );

                }

            }


            errorPassword
                .classList
                .remove(
                    "visible"
                );

        }
    );


    codigo.addEventListener(
        "keydown",
        function (e) {

            if (
                e.key ===
                "Enter"
            ) {

                comprobarPassword();

            }

        }
    );

}



/* =========================================================
   BOTÓN ABRIR
========================================================= */

if (botonAbrir) {

    botonAbrir.addEventListener(
        "click",
        comprobarPassword
    );

}



/* =========================================================
   COMPROBAR PASSWORD
========================================================= */

function comprobarPassword() {

    if (
        !codigo
    ) {

        return;

    }


    if (
        codigo.value ===
        CONTRASENA
    ) {

        errorPassword
            .classList
            .remove(
                "visible"
            );


        pantallaPassword
            .classList
            .remove(
                "visible"
            );


        setTimeout(
            function () {

                contenido
                    .classList
                    .add(
                        "visible"
                    );


                comenzarEfectosFinales();

            },
            700
        );


    } else {

        errorPassword
            .classList
            .add(
                "visible"
            );


        codigo.value =
            "";


        puntosCodigo.forEach(
            function (punto) {

                punto.classList
                    .remove(
                        "activo"
                    );

            }
        );


        codigo.focus();

    }

}



/* =========================================================
   EFECTOS DEL CONTENIDO FINAL
========================================================= */

const fuentesFinales = [

    "'Cormorant Garamond', serif",

    "'Dancing Script', cursive",

    "'Great Vibes', cursive",

    "'Cormorant Garamond', serif",

    "'Montserrat', sans-serif"

];


const coloresFinales = [

    "#a94d68",

    "#b87563",

    "#9e5368",

    "#c49a8d",

    "#7e394e",

    "#b98a83"

];


const mensajesFinales = [

    "Te amo",

    "Te quiero",

    "Te adoro",

    "Mi amor",

    "Siempre tú",

    "Contigo",

    "Mi vida",

    "Tú y yo",

    "Te amo ❤️",

    "Te elegiría otra vez",

    "Mi cielo",

    "Eres mi todo"

];



/* =========================================================
   CREAR TE AMO
========================================================= */

function crearTeAmo() {

    if (
        !teAmos
    ) {

        return;

    }


    const elemento =
        document.createElement(
            "div"
        );


    elemento.classList.add(
        "te-amo"
    );


    elemento.textContent =
        mensajesFinales[
            Math.floor(
                Math.random() *
                mensajesFinales.length
            )
        ];


    elemento.style.left =
        Math.random() *
        100 +
        "%";


    elemento.style.top =
        Math.random() *
        100 +
        "%";


    elemento.style.fontSize =
        (
            Math.random() *
            18 +
            12
        ) +
        "px";


    elemento.style.fontFamily =
        fuentesFinales[
            Math.floor(
                Math.random() *
                fuentesFinales.length
            )
        ];


    elemento.style.color =
        coloresFinales[
            Math.floor(
                Math.random() *
                coloresFinales.length
            )
        ];


    elemento.style.transform =
        `rotate(${Math.random() * 14 - 7}deg)`;


    const duracion =
        Math.random() *
        9 +
        10;


    elemento.style.animationDuration =
        duracion +
        "s";


    elemento.style.animationDelay =
        Math.random() *
        3 +
        "s";


    teAmos.appendChild(
        elemento
    );


    setTimeout(
        function () {

            elemento.remove();

        },
        (
            duracion +
            4
        ) *
        1000
    );

}



/* =========================================================
   CREAR CORAZÓN
========================================================= */

function crearCorazon() {

    if (
        !corazones
    ) {

        return;

    }


    const elemento =
        document.createElement(
            "div"
        );


    elemento.classList.add(
        "corazon"
    );


    const lista = [

        "♥",

        "♡",

        "❤"

    ];


    elemento.textContent =
        lista[
            Math.floor(
                Math.random() *
                lista.length
            )
        ];


    elemento.style.left =
        Math.random() *
        100 +
        "%";


    elemento.style.fontSize =
        (
            Math.random() *
            14 +
            9
        ) +
        "px";


    const duracion =
        Math.random() *
        8 +
        8;


    elemento.style.animationDuration =
        duracion +
        "s";


    corazones.appendChild(
        elemento
    );


    setTimeout(
        function () {

            elemento.remove();

        },
        (
            duracion +
            2
        ) *
        1000
    );

}



/* =========================================================
   CREAR PARTÍCULA
========================================================= */

function crearParticula() {

    if (
        !particulas
    ) {

        return;

    }


    const elemento =
        document.createElement(
            "div"
        );


    elemento.classList.add(
        "particula"
    );


    elemento.style.left =
        Math.random() *
        100 +
        "%";


    elemento.style.top =
        Math.random() *
        100 +
        "%";


    elemento.style.animationDelay =
        Math.random() *
        3 +
        "s";


    elemento.style.animationDuration =
        (
            Math.random() *
            3 +
            2
        ) +
        "s";


    particulas.appendChild(
        elemento
    );

}



/* =========================================================
   EFECTOS FINALES
========================================================= */

function comenzarEfectosFinales() {


    /*
       Frases iniciales
    */

    for (
        let i = 0;
        i < 45;
        i++
    ) {

        crearTeAmo();

    }


    /*
       Partículas iniciales
    */

    for (
        let i = 0;
        i < 65;
        i++
    ) {

        crearParticula();

    }


    /*
       Nuevas frases
    */

    setInterval(
        function () {

            crearTeAmo();

        },
        800
    );


    /*
       Corazones
    */

    setInterval(
        function () {

            crearCorazon();

        },
        1200
    );

}



/* =========================================================
   INICIALIZACIÓN
========================================================= */

/*
   Dejamos preparado el canvas desde el principio,
   pero la animación solamente comienza cuando
   se pulsa "Comenzar".
*/

ajustarCanvas();


/*
   Posición inicial de cámara
*/

camaraX = 0;

camaraY = 0;

objetivoCamaraX = 0;

objetivoCamaraY = 0;


/* =========================================================
   NUEVO
   BOTONES EXTRA DEL PANEL FINAL
   (MÚSICA / FOTOS / CARTA) + MODALES
========================================================= */

const botonCambiarMusica =
    document.getElementById("boton-cambiar-musica");

const botonVerFotos =
    document.getElementById("boton-ver-fotos");

const botonVerCarta =
    document.getElementById("boton-ver-carta");

const modalMusica =
    document.getElementById("modal-musica");

const modalFotos =
    document.getElementById("modal-fotos");

const modalCarta =
    document.getElementById("modal-carta");


function abrirModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.add("visible");

}


function cerrarModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.remove("visible");

}


if (botonCambiarMusica) {

    botonCambiarMusica.addEventListener(
        "click",
        function () {

            abrirModal(modalMusica);

        }
    );

}


if (botonVerFotos) {

    botonVerFotos.addEventListener(
        "click",
        function () {

            abrirModal(modalFotos);

        }
    );

}


if (botonVerCarta) {

    botonVerCarta.addEventListener(
        "click",
        function () {

            abrirModal(modalCarta);

        }
    );

}


/*
   Botones de cerrar (✕) dentro de cualquier modal
*/

document.querySelectorAll(".modal-cerrar")
    .forEach(function (boton) {

        boton.addEventListener("click", function () {

            const idModal =
                boton.getAttribute("data-cerrar");

            cerrarModal(
                document.getElementById(idModal)
            );

        });

    });


/*
   Cerrar el modal si se hace click fuera de la caja
*/

document.querySelectorAll(".modal-overlay")
    .forEach(function (overlay) {

        overlay.addEventListener("click", function (e) {

            if (e.target === overlay) {

                cerrarModal(overlay);

            }

        });

    });


/*
   Elegir canción desde el modal de música
   (reutiliza la misma función seleccionarCancion,
   pero NO reinicia la galaxia, solo cambia la canción)
*/

document.querySelectorAll(
    "#modal-musica .opcion-cancion"
).forEach(function (boton) {

    boton.addEventListener("click", function () {

        seleccionarCancion(
            boton.getAttribute("data-src")
        );

        cerrarModal(modalMusica);

    });

});

