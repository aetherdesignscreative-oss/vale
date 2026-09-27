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
    "2026";

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
   BOTÓN COMENZAR
========================================================= */

if (botonComenzar) {

    botonComenzar.addEventListener(
        "click",
        function () {

            iniciarMusica();

            pantallaInicio
                .classList
                .add("oculta");


            setTimeout(
                function () {

                    galaxiaPantalla
                        .classList
                        .add("visible");

                    iniciarGalaxia();

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
   MENÚS ROMÁNTICOS + SISTEMA DE CANCIONES
   ========================================================= */

(function () {

    /* ---------------------------------------------------------
       CANCIONES
    --------------------------------------------------------- */

    const canciones = [
        {
            nombre: "In a God Day",
            archivo: "in a god day.mp3"
        },
        {
            nombre: "Campus Fashion",
            archivo: "campus fashion.mp3"
        },
        {
            nombre: "Next To You",
            archivo: "next to you.mp3"
        },
        {
            nombre: "Origami",
            archivo: "origami.mp3"
        }
    ];

    let cancionActual = -1;
    let cancionesDisponibles = [...canciones];


    /* ---------------------------------------------------------
       AUDIO EXISTENTE
       --------------------------------------------------------- */

    const reproductor = document.getElementById("musica");

    if (!reproductor) {
        console.warn("No se encontró el reproductor #musica");
        return;
    }

    reproductor.loop = false;
    reproductor.volume = 0.45;


    /* ---------------------------------------------------------
       FUNCIÓN PARA OBTENER UNA CANCIÓN ALEATORIA
       SIN REPETIR HASTA PASAR POR TODAS
    --------------------------------------------------------- */

    function obtenerCancionAleatoria() {

        if (cancionesDisponibles.length === 0) {
            cancionesDisponibles = [...canciones];
        }

        const posicion =
            Math.floor(
                Math.random() *
                cancionesDisponibles.length
            );

        const cancion =
            cancionesDisponibles.splice(
                posicion,
                1
            )[0];

        return cancion;
    }


    /* ---------------------------------------------------------
       REPRODUCIR CANCIÓN
    --------------------------------------------------------- */

    function reproducirCancion(cancion, desdeInicio = false) {

        if (!cancion) {
            return;
        }

        cancionActual =
            canciones.findIndex(
                c => c.archivo === cancion.archivo
            );

        reproductor.src = cancion.archivo;

        reproductor.load();

        reproductor.play()
            .then(function () {

                actualizarNombreCancion(
                    cancion.nombre
                );

            })
            .catch(function (error) {

                console.log(
                    "El navegador bloqueó la reproducción:",
                    error
                );

            });

    }


    /* ---------------------------------------------------------
       ACTUALIZAR NOMBRE DE CANCIÓN
    --------------------------------------------------------- */

    function actualizarNombreCancion(nombre) {

        const elementos =
            document.querySelectorAll(
                ".nombre-cancion-actual"
            );

        elementos.forEach(
            function (elemento) {

                elemento.textContent =
                    nombre;

            }
        );

    }


    /* ---------------------------------------------------------
       CUANDO TERMINA UNA CANCIÓN
       PASA AUTOMÁTICAMENTE A OTRA
    --------------------------------------------------------- */

    reproductor.addEventListener(
        "ended",
        function () {

            const siguiente =
                obtenerCancionAleatoria();

            reproducirCancion(
                siguiente
            );

        }
    );


    /* =========================================================
       PRIMER MENÚ: ELEGIR CANCIÓN
       ========================================================= */

    const selectorMusica =
        document.createElement("div");

    selectorMusica.id =
        "selector-musica-inicial";


    selectorMusica.innerHTML = `

        <div class="selector-musica-fondo"></div>

        <div class="selector-musica-card">

            <div class="selector-corazon">
                ♥
            </div>

            <span class="selector-pequeno">
                PARA TI
            </span>

            <h2>
                Elige nuestra canción
            </h2>

            <p>
                Escoge una y deja que comience
                nuestro pequeño universo.
            </p>

            <div class="lista-canciones-inicial">

                ${canciones.map(
                    function (cancion, indice) {

                        return `

                            <button
                                class="cancion-inicial"
                                data-indice="${indice}"
                            >

                                <span class="icono-cancion">
                                    ♫
                                </span>

                                <span>
                                    ${cancion.nombre}
                                </span>

                                <span class="flecha-cancion">
                                    →
                                </span>

                            </button>

                        `;

                    }
                ).join("")}

            </div>

            <div class="nombre-cancion-actual">
                Ninguna canción
            </div>

        </div>

    `;


    document.body.appendChild(
        selectorMusica
    );


    /* ---------------------------------------------------------
       ESTILOS DEL PRIMER MENÚ
    --------------------------------------------------------- */

    const estilosMenu =
        document.createElement("style");

    estilosMenu.textContent = `

        #selector-musica-inicial {

            position: fixed;
            inset: 0;
            z-index: 99999;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 25px;

            background:
                radial-gradient(
                    circle at center,
                    rgba(150, 20, 130, .18),
                    transparent 50%
                ),
                #030203;

            transition:
                opacity .7s ease,
                visibility .7s ease;

        }


        #selector-musica-inicial.oculto {

            opacity: 0;
            visibility: hidden;
            pointer-events: none;

        }


        .selector-musica-card {

            width: min(
                430px,
                100%
            );

            padding: 38px 28px;

            border: 1px solid
                rgba(255, 170, 220, .22);

            border-radius: 28px;

            background:
                linear-gradient(
                    145deg,
                    rgba(45, 10, 45, .88),
                    rgba(12, 4, 18, .95)
                );

            box-shadow:
                0 30px 80px
                rgba(0,0,0,.65),

                0 0 60px
                rgba(220, 30, 190, .12);

            text-align: center;

            color: white;

            backdrop-filter:
                blur(18px);

        }


        .selector-corazon {

            width: 65px;
            height: 65px;

            margin: 0 auto 18px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;

            color: #ff8fdc;

            font-size: 30px;

            background:
                rgba(255, 80, 200, .08);

            box-shadow:
                0 0 35px
                rgba(255, 50, 210, .22);

        }


        .selector-pequeno {

            font-size: 11px;

            letter-spacing: 4px;

            color:
                rgba(255, 190, 225, .65);

        }


        .selector-musica-card h2 {

            margin:
                12px 0 8px;

            font-family:
                Georgia,
                serif;

            font-size: 30px;

            font-weight: 400;

        }


        .selector-musica-card p {

            margin:
                0 auto 25px;

            max-width: 330px;

            color:
                rgba(255,255,255,.6);

            font-size: 14px;

            line-height: 1.7;

        }


        .lista-canciones-inicial {

            display: flex;

            flex-direction: column;

            gap: 10px;

        }


        .cancion-inicial {

            width: 100%;

            display: grid;

            grid-template-columns:
                40px 1fr 25px;

            align-items: center;

            padding: 14px 15px;

            border: 1px solid
                rgba(255,255,255,.09);

            border-radius: 15px;

            background:
                rgba(255,255,255,.035);

            color: white;

            cursor: pointer;

            text-align: left;

            transition:
                transform .25s ease,
                background .25s ease,
                border .25s ease;

        }


        .cancion-inicial:hover {

            transform:
                translateY(-2px);

            background:
                rgba(255, 80, 200, .10);

            border-color:
                rgba(255, 140, 220, .35);

        }


        .icono-cancion {

            color:
                #ff8edc;

            font-size: 20px;

        }


        .flecha-cancion {

            color:
                rgba(255,255,255,.4);

            text-align: right;

        }


        .nombre-cancion-actual {

            margin-top: 18px;

            font-size: 11px;

            color:
                rgba(255,170,220,.55);

            letter-spacing: 1px;

        }


        /* =====================================================
           MENÚ INFERIOR
        ===================================================== */

        #menu-romantico {

            position: fixed;

            z-index: 9000;

            left: 50%;

            bottom: 22px;

            transform:
                translateX(-50%);

            display: flex;

            gap: 12px;

            padding: 10px;

            border:
                1px solid
                rgba(255,255,255,.12);

            border-radius: 22px;

            background:
                rgba(12, 4, 18, .72);

            backdrop-filter:
                blur(18px);

            box-shadow:
                0 12px 40px
                rgba(0,0,0,.45);

        }


        .boton-menu-romantico {

            width: 52px;
            height: 52px;

            border: 0;

            border-radius: 17px;

            display: flex;

            align-items: center;

            justify-content: center;

            background:
                rgba(255,255,255,.07);

            color: white;

            font-size: 22px;

            cursor: pointer;

            transition:
                transform .25s ease,
                background .25s ease,
                box-shadow .25s ease;

        }


        .boton-menu-romantico:hover {

            transform:
                translateY(-3px);

            background:
                rgba(255, 80, 200, .14);

            box-shadow:
                0 0 25px
                rgba(255, 80, 200, .15);

        }


        /* =====================================================
           PANELES
        ===================================================== */

        .panel-romantico {

            position: fixed;

            inset: 0;

            z-index: 9500;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 25px;

            background:
                rgba(3,2,3,.72);

            backdrop-filter:
                blur(15px);

            opacity: 0;

            visibility: hidden;

            pointer-events: none;

            transition:
                opacity .35s ease,
                visibility .35s ease;

        }


        .panel-romantico.visible {

            opacity: 1;

            visibility: visible;

            pointer-events: auto;

        }


        .panel-romantico-contenido {

            position: relative;

            width: min(
                430px,
                100%
            );

            max-height: 85vh;

            overflow-y: auto;

            padding: 35px 25px;

            border:
                1px solid
                rgba(255,160,220,.2);

            border-radius: 28px;

            background:
                linear-gradient(
                    145deg,
                    rgba(35,8,40,.96),
                    rgba(8,3,13,.98)
                );

            box-shadow:
                0 30px 80px
                rgba(0,0,0,.65),

                0 0 60px
                rgba(220,30,190,.10);

            color: white;

            text-align: center;

        }


        .cerrar-panel-romantico {

            position: absolute;

            top: 15px;
            left: 15px;

            width: 38px;
            height: 38px;

            border: 0;

            border-radius: 50%;

            background:
                rgba(255,255,255,.07);

            color: white;

            font-size: 20px;

            cursor: pointer;

        }


        .panel-romantico-icono {

            font-size: 42px;

            margin-bottom: 10px;

        }


        .panel-romantico h2 {

            margin:
                5px 0 10px;

            font-family:
                Georgia,
                serif;

            font-size: 28px;

            font-weight: 400;

        }


        .panel-romantico p {

            color:
                rgba(255,255,255,.62);

            line-height: 1.7;

            font-size: 14px;

        }


        /* =====================================================
           CANCIONES DEL PANEL
        ===================================================== */

        .cancion-panel {

            width: 100%;

            margin-top: 9px;

            padding: 14px;

            border: 1px solid
                rgba(255,255,255,.08);

            border-radius: 15px;

            background:
                rgba(255,255,255,.04);

            color: white;

            text-align: left;

            cursor: pointer;

            transition:
                background .2s ease,
                transform .2s ease;

        }


        .cancion-panel:hover {

            background:
                rgba(255,80,200,.11);

            transform:
                translateX(3px);

        }


        .cancion-panel.activa {

            border-color:
                rgba(255,140,220,.4);

            background:
                rgba(255,80,200,.12);

        }


        /* =====================================================
           FOTOS
        ===================================================== */

        .fotos-vacias {

            padding:
                30px 15px;

        }


        .candado-fotos {

            width: 75px;
            height: 75px;

            margin:
                0 auto 20px;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 50%;

            background:
                rgba(255,255,255,.05);

            font-size: 35px;

            box-shadow:
                0 0 35px
                rgba(255,80,200,.12);

        }


        .boton-regresar-panel {

            margin-top: 20px;

            padding:
                12px 22px;

            border: 1px solid
                rgba(255,160,220,.2);

            border-radius: 20px;

            background:
                rgba(255,255,255,.06);

            color: white;

            cursor: pointer;

        }


        /* =====================================================
           CARTA
        ===================================================== */

        .carta-imagen {

            width: 100%;

            max-height: 60vh;

            object-fit: contain;

            border-radius: 14px;

            box-shadow:
                0 15px 45px
                rgba(0,0,0,.5);

        }


        @media (max-width: 500px) {

            #menu-romantico {

                bottom:
                    max(15px, env(safe-area-inset-bottom));

            }

            .boton-menu-romantico {

                width: 48px;
                height: 48px;

            }

            .selector-musica-card {

                padding:
                    30px 20px;

            }

        }

    `;

    document.head.appendChild(
        estilosMenu
    );


    /* =========================================================
       BOTONES DE LA PRIMERA PANTALLA
       ========================================================= */

    document
        .querySelectorAll(
            ".cancion-inicial"
        )
        .forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        const indice =
                            Number(
                                boton.dataset.indice
                            );

                        const cancion =
                            canciones[indice];

                        /* Quitamos la canción elegida
                           del próximo orden aleatorio */

                        cancionesDisponibles =
                            canciones.filter(
                                function (c) {
                                    return (
                                        c.archivo !==
                                        cancion.archivo
                                    );
                                }
                            );

                        reproducirCancion(
                            cancion
                        );

                        /*
                           Ocultar selector
                        */

                        selectorMusica
                            .classList
                            .add("oculto");


                        /*
                           Después de elegir la canción,
                           dejamos que TU botón original
                           haga exactamente lo que ya hacía.
                        */

                        const botonComenzar =
                            document.getElementById(
                                "boton-comenzar"
                            );

                        if (botonComenzar) {

                            setTimeout(
                                function () {

                                    botonComenzar.click();

                                },
                                250
                            );

                        }

                    }
                );

            }
        );


    /* =========================================================
       CREAR MENÚ INFERIOR
       ========================================================= */

    const menu =
        document.createElement("div");

    menu.id =
        "menu-romantico";

    menu.innerHTML = `

        <button
            class="boton-menu-romantico"
            id="abrir-menu-musica"
            aria-label="Música"
        >
            ♫
        </button>

        <button
            class="boton-menu-romantico"
            id="abrir-menu-fotos"
            aria-label="Fotos"
        >
            📷
        </button>

        <button
            class="boton-menu-romantico"
            id="abrir-menu-carta"
            aria-label="Carta"
        >
            💌
        </button>

    `;

    document.body.appendChild(menu);


    /* =========================================================
       PANEL DE MÚSICA
       ========================================================= */

    const panelMusica =
        document.createElement("div");

    panelMusica.className =
        "panel-romantico";

    panelMusica.id =
        "panel-musica-romantico";

    panelMusica.innerHTML = `

        <div class="panel-romantico-contenido">

            <button
                class="cerrar-panel-romantico"
                data-cerrar-panel
            >
                ←
            </button>

            <div class="panel-romantico-icono">
                🎵
            </div>

            <h2>
                Nuestra música
            </h2>

            <p>
                Puedes cambiar nuestra canción
                cuando quieras.
            </p>

            <div id="lista-musica-panel">

                ${canciones.map(
                    function (cancion, indice) {

                        return `

                            <button
                                class="cancion-panel"
                                data-cancion-panel="${indice}"
                            >
                                ♫ &nbsp;
                                ${cancion.nombre}
                            </button>

                        `;

                    }
                ).join("")}

            </div>

            <div
                class="nombre-cancion-actual"
                style="margin-top:18px;"
            >
                Ninguna canción
            </div>

        </div>

    `;

    document.body.appendChild(
        panelMusica
    );


    /* =========================================================
       PANEL DE FOTOS
       ========================================================= */

    const panelFotos =
        document.createElement("div");

    panelFotos.className =
        "panel-romantico";

    panelFotos.id =
        "panel-fotos-romantico";

    panelFotos.innerHTML = `

        <div class="panel-romantico-contenido">

            <button
                class="cerrar-panel-romantico"
                data-cerrar-panel
            >
                ←
            </button>

            <div class="panel-romantico-icono">
                📷
            </div>

            <h2>
                Nuestros recuerdos
            </h2>

            <div class="fotos-vacias">

                <div class="candado-fotos">
                    🔒
                </div>

                <h3>
                    Sin fotos suficientes
                </h3>

                <p>
                    Porfavor envíame más fotos
                    para llenar nuestro pequeño
                    álbum de recuerdos. ❤️
                </p>

            </div>

            <button
                class="boton-regresar-panel"
                data-cerrar-panel
            >
                ← Regresar
            </button>

        </div>

    `;

    document.body.appendChild(
        panelFotos
    );


    /* =========================================================
       PANEL DE CARTA
       ========================================================= */

    const panelCarta =
        document.createElement("div");

    panelCarta.className =
        "panel-romantico";

    panelCarta.id =
        "panel-carta-romantico";

    panelCarta.innerHTML = `

        <div class="panel-romantico-contenido">

            <button
                class="cerrar-panel-romantico"
                data-cerrar-panel
            >
                ←
            </button>

            <div class="panel-romantico-icono">
                💌
            </div>

            <h2>
                Una carta para ti
            </h2>

            <img
                src="carta.png"
                alt="Nuestra carta"
                class="carta-imagen"
            >

            <button
                class="boton-regresar-panel"
                data-cerrar-panel
            >
                ← Regresar
            </button>

        </div>

    `;

    document.body.appendChild(
        panelCarta
    );


    /* =========================================================
       ABRIR / CERRAR PANELES
       ========================================================= */

    function abrirPanel(panel) {

        if (!panel) {
            return;
        }

        panel.classList.add(
            "visible"
        );

    }


    function cerrarPanel(panel) {

        if (!panel) {
            return;
        }

        panel.classList.remove(
            "visible"
        );

    }


    document
        .getElementById(
            "abrir-menu-musica"
        )
        .addEventListener(
            "click",
            function () {

                abrirPanel(
                    panelMusica
                );

            }
        );


    document
        .getElementById(
            "abrir-menu-fotos"
        )
        .addEventListener(
            "click",
            function () {

                abrirPanel(
                    panelFotos
                );

            }
        );


    document
        .getElementById(
            "abrir-menu-carta"
        )
        .addEventListener(
            "click",
            function () {

                abrirPanel(
                    panelCarta
                );

            }
        );


    document
        .querySelectorAll(
            "[data-cerrar-panel]"
        )
        .forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        const panel =
                            boton.closest(
                                ".panel-romantico"
                            );

                        cerrarPanel(
                            panel
                        );

                    }
                );

            }
        );


    /* =========================================================
       CAMBIAR CANCIÓN DESDE EL PANEL
       ========================================================= */

    document
        .querySelectorAll(
            "[data-cancion-panel]"
        )
        .forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        const indice =
                            Number(
                                boton.dataset
                                    .cancionPanel
                            );

                        const cancion =
                            canciones[indice];

                        cancionesDisponibles =
                            canciones.filter(
                                function (c) {
                                    return (
                                        c.archivo !==
                                        cancion.archivo
                                    );
                                }
                            );

                        reproducirCancion(
                            cancion
                        );


                        /*
                           Marcar canción activa
                        */

                        document
                            .querySelectorAll(
                                ".cancion-panel"
                            )
                            .forEach(
                                function (otro) {

                                    otro.classList
                                        .remove(
                                            "activa"
                                        );

                                }
                            );

                        boton.classList.add(
                            "activa"
                        );

                    }
                );

            }
        );


    /* =========================================================
       DESPUÉS DE LA CONTRASEÑA
       MOSTRAR EL MENÚ
       ========================================================= */

    const contenidoFinal =
        document.getElementById(
            "contenido"
        );


    if (contenidoFinal) {

        const observador =
            new MutationObserver(
                function () {

                    if (
                        contenidoFinal
                            .classList
                            .contains(
                                "visible"
                            )
                    ) {

                        menu.style.display =
                            "flex";

                    }

                }
            );


        observador.observe(
            contenidoFinal,
            {
                attributes: true,
                attributeFilter: [
                    "class"
                ]
            }
        );

    }


    /*
       El menú empieza oculto.
       Solo aparece después de la contraseña.
    */

    menu.style.display =
        "none";


    /* =========================================================
       COMPATIBILIDAD CON EL BOTÓN MUSICAL ORIGINAL
       ========================================================= */

    /*
       El sitio original ya tiene #control-musica.
       Lo dejamos funcionando para no romper nada.
    */

    const controlOriginal =
        document.getElementById(
            "control-musica"
        );

    if (controlOriginal) {

        controlOriginal.addEventListener(
            "click",
            function () {

                /*
                   Si no hay canción,
                   seleccionamos una.
                */

                if (
                    !reproductor.src ||
                    reproductor.src.endsWith("/")
                ) {

                    const nueva =
                        obtenerCancionAleatoria();

                    reproducirCancion(
                        nueva
                    );

                    return;

                }

            }
        );

    }


    /* =========================================================
       CERRAR PANEL TOCANDO FUERA
       ========================================================= */

    [
        panelMusica,
        panelFotos,
        panelCarta
    ].forEach(
        function (panel) {

            panel.addEventListener(
                "click",
                function (evento) {

                    if (
                        evento.target ===
                        panel
                    ) {

                        cerrarPanel(
                            panel
                        );

                    }

                }
            );

        }
    );


})();
