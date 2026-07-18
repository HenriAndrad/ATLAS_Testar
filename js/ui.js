class UIManager {

    constructor() {

        this.loadingScreen = document.getElementById("loading-screen");
        this.loadingText = document.getElementById("loading-text");

        this.translatedName = document.getElementById("translated-name");
        this.originalName = document.getElementById("original-name");
        this.confidence = document.getElementById("confidence");

        this.languageSelect = document.getElementById("language-select");

        this.btnSpeak = document.getElementById("btn-speak");
        this.btnFreeze = document.getElementById("btn-freeze");
        this.btnCamera = document.getElementById("btn-camera");

    }

    setLoading(texto) {

        this.loadingText.textContent = texto;

    }

    hideLoading() {

        this.loadingScreen.style.display = "none";

    }

    showLoading() {

        this.loadingScreen.style.display = "flex";

    }

    atualizarResultado({

        traduzido = "Aguardando...",
        original = "—",
        confianca = "--"

    } = {}) {

        this.translatedName.textContent = traduzido;
        this.originalName.textContent = original;
        this.confidence.textContent = `Confiança: ${confianca}`;

    }

    limparResultado() {

        this.atualizarResultado();

    }

    getIdiomaSelecionado() {

        return this.languageSelect.value;

    }

    onTrocarIdioma(callback) {

        this.languageSelect.addEventListener("change", () => {

            callback(this.languageSelect.value);

        });

    }

    onFalar(callback) {

        this.btnSpeak.addEventListener("click", callback);

    }

    onCongelar(callback) {

        this.btnFreeze.addEventListener("click", callback);

    }

    onTrocarCamera(callback) {

        this.btnCamera.addEventListener("click", callback);

    }

    alterarTextoBotaoCongelar(congelado) {

        this.btnFreeze.textContent = congelado
            ? "▶ Continuar"
            : "⏸ Congelar";

    }

}

export function iniciarUI() {

    return new UIManager();

}