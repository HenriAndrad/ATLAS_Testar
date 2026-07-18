class SpeechManager {

    constructor() {

        this.synth = window.speechSynthesis;
        this.voice = null;
        this.language = "pt-BR";

        this.carregarVozes();

        window.speechSynthesis.onvoiceschanged = () => {

            this.carregarVozes();

        };

    }

    carregarVozes() {

        const vozes = this.synth.getVoices();

        this.voice = vozes.find(v => v.lang === this.language);

        if (!this.voice) {

            this.voice = vozes.find(v => v.lang.startsWith("pt"));

        }

        if (!this.voice && vozes.length > 0) {

            this.voice = vozes[0];

        }

    }

    definirIdioma(idioma) {

        const idiomas = {

            pt: "pt-BR",
            en: "en-US",
            es: "es-ES",
            fr: "fr-FR",
            de: "de-DE"

        };

        this.language = idiomas[idioma] || "pt-BR";

        this.carregarVozes();

    }

    falar(texto) {

        if (!texto || texto === "Aguardando...") return;

        this.synth.cancel();

        const fala = new SpeechSynthesisUtterance(texto);

        fala.lang = this.language;

        fala.voice = this.voice;

        fala.rate = 1;

        fala.pitch = 1;

        fala.volume = 1;

        this.synth.speak(fala);

    }

    parar() {

        this.synth.cancel();

    }

}

export function iniciarSpeech() {

    return new SpeechManager();

}