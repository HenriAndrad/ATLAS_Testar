import {
    traduzirLocal
} from "./dictionary.js";

class TranslatorManager {

    constructor() {

        this.cache = new Map();
        this.idiomaDestino = "pt";

    }

    async iniciar() {

        console.log("Tradutor local iniciado.");

        return this;

    }

    definirIdioma(idioma) {

        this.idiomaDestino = idioma;

    }

    async traduzir(texto) {

        if (!texto) return "";

        const chave = `${texto}-${this.idiomaDestino}`.toLowerCase();

        if (this.cache.has(chave)) {

            return this.cache.get(chave);

        }

        const traducao = traduzirLocal(texto);

        this.cache.set(chave, traducao);

        return traducao;

    }

    limparCache() {

        this.cache.clear();

    }

}

export async function iniciarTradutor() {

    const translator = new TranslatorManager();

    return await translator.iniciar();

}