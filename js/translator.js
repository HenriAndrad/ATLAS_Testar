import { pipeline } from "@huggingface/transformers";
import {
    traduzirLocal,
    adicionarTraducao
} from "./dictionary.js";

class TranslatorManager {

    constructor() {

        this.pipeline = null;

        this.cache = new Map();

        this.modeloCarregado = false;

        this.idiomaDestino = "pt";

    }

    async iniciar() {

        try {

            this.pipeline = await pipeline(
                "translation",
                "Xenova/nllb-200-distilled-600M"
            );

            this.modeloCarregado = true;

        }

        catch (erro) {

            console.warn("Transformers.js indisponível.");

            this.modeloCarregado = false;

        }

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

        const local = traduzirLocal(texto);

        if (local !== texto) {

            this.cache.set(chave, local);

            return local;

        }

        if (!this.modeloCarregado) {

            return texto;

        }

        try {

            const resultado = await this.pipeline(texto, {

                src_lang: "eng_Latn",

                tgt_lang: this.obterCodigoIdioma()

            });

            const traducao = resultado[0].translation_text;

            adicionarTraducao(texto, traducao);

            this.cache.set(chave, traducao);

            return traducao;

        }

        catch (erro) {

            console.error(erro);

            return texto;

        }

    }

    obterCodigoIdioma() {

        const idiomas = {

            pt: "por_Latn",

            en: "eng_Latn",

            es: "spa_Latn",

            fr: "fra_Latn",

            de: "deu_Latn"

        };

        return idiomas[this.idiomaDestino] || "por_Latn";

    }

    limparCache() {

        this.cache.clear();

    }

}

export async function iniciarTradutor() {

    const translator = new TranslatorManager();

    return await translator.iniciar();

}