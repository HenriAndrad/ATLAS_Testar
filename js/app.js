import { iniciarCamera } from "./camera.js";
import { iniciarDetector } from "./detector.js";
import { iniciarTradutor } from "./translator.js";
import { iniciarSpeech } from "./speech.js";
import { iniciarUI } from "./ui.js";
import { carregarImagemTeste } from "./testImage.js";

class VisualTranslator {

    constructor() {

        this.camera = null;
        this.detector = null;
        this.translator = null;
        this.speech = null;
        this.ui = null;

        this.ultimoObjeto = "";
        this.ultimoInstante = 0;
        this.intervaloFala = 2000;

        this.overlay = document.getElementById("overlay");

    }

    async iniciar() {

        try {

            this.ui = iniciarUI();

            let source = null;

try {

    this.ui.setLoading("Iniciando câmera...");

    this.camera = await iniciarCamera();

    source = this.camera.getVideo();

}
catch {

    console.warn("Nenhuma câmera encontrada. Usando imagem de teste.");

    source = await carregarImagemTeste();

}

this.ui.setLoading("Carregando modelo de IA...");

this.detector = await iniciarDetector(source);

            this.ui.setLoading("Inicializando tradutor...");

            this.translator = await iniciarTradutor();

            this.ui.setLoading("Inicializando voz...");

            this.speech = iniciarSpeech();

           const idioma = this.ui.getIdiomaSelecionado();

this.translator.definirIdioma(idioma);
this.speech.definirIdioma(idioma);

this.ui.onTrocarIdioma((novoIdioma) => {

    this.translator.definirIdioma(novoIdioma);
    this.speech.definirIdioma(novoIdioma);

});

this.translator.definirIdioma(idioma);
this.speech.definirIdioma(idioma);

this.ui.onTrocarIdioma((novoIdioma) => {

    this.translator.definirIdioma(novoIdioma);
    this.speech.definirIdioma(novoIdioma);

});

            this.ui.hideLoading();

            console.log("Aplicação iniciada com sucesso.");

            this.loop();

        }

        catch (erro) {

    console.error("===== ERRO AO INICIAR =====");
    console.error(erro);
    console.error(erro.stack);

    alert(erro.message);

}

    }

    async loop() {

    requestAnimationFrame(() => this.loop());

    if (
        !this.detector ||
        !this.translator ||
        !this.ui
    ) {
        return;
    }

    const objetos = await this.detector.detectar();
    this.detector.desenharDeteccoes(
    this.overlay,
    objetos
);

    if (!objetos.length)
        return;

    const melhor = objetos.reduce((a, b) =>
        a.confianca > b.confianca ? a : b
    );

    const traducao =
        await this.translator.traduzir(
            melhor.classe
        );

    this.ui.atualizarResultado({

    original: melhor.classe,
    traduzido: traducao,
    confianca: `${(melhor.confianca * 100).toFixed(1)}%`

});

    const agora = Date.now();

    if (
        melhor.classe !== this.ultimoObjeto ||
        agora - this.ultimoInstante >
            this.intervaloFala
    ) {

        this.ultimoObjeto = melhor.classe;
        this.ultimoInstante = agora;

        this.speech.falar(traducao);

    }

}

}

const app = new VisualTranslator();

window.addEventListener("DOMContentLoaded", () => {

    app.iniciar();

});