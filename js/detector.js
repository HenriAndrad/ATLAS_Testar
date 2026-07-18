import * as ort from "onnxruntime-web";
ort.env.wasm.wasmPaths = `${import.meta.env.BASE_URL}wasm/`;

class DetectorManager {

    constructor(source) {

        this.source = source;

        this.session = null;
        this.classes = [];

        this.modelSize = 640;

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.confidenceThreshold = 0.40;

    }

    async iniciar() {

        await this.carregarClasses();
        await this.carregarModelo();

    }

    async carregarClasses() {

    console.log("Carregando classes...");

    const base = import.meta.env.BASE_URL;

    const resposta = await fetch(`${base}models/coco.names`);

    if (!resposta.ok) {
        throw new Error(`Não foi possível carregar coco.names (${resposta.status})`);
    }

    const texto = await resposta.text();

    this.classes = texto
        .split("\n")
        .map(item => item.trim())
        .filter(Boolean);

    console.log("Classes carregadas.");

}

    async carregarModelo() {

    console.log("Carregando modelo...");

    this.session = await ort.InferenceSession.create(
        "./models/yolov8n.onnx",
        {
            executionProviders: ["wasm"]
        }
    );

    console.log("Modelo carregado.");

}

    preprocessar() {

        this.canvas.width = this.modelSize;
        this.canvas.height = this.modelSize;

        this.ctx.clearRect(
            0,
            0,
            this.modelSize,
            this.modelSize
        );

        this.ctx.drawImage(
            this.source,
            0,
            0,
            this.modelSize,
            this.modelSize
        );

        const imageData = this.ctx.getImageData(
            0,
            0,
            this.modelSize,
            this.modelSize
        );

        const { data } = imageData;

        const tensor = new Float32Array(
            3 * this.modelSize * this.modelSize
        );

        const area = this.modelSize * this.modelSize;

        for (let i = 0; i < area; i++) {

            tensor[i] = data[i * 4] / 255;

            tensor[i + area] =
                data[i * 4 + 1] / 255;

            tensor[i + area * 2] =
                data[i * 4 + 2] / 255;

        }

        return new ort.Tensor(
            "float32",
            tensor,
            [1, 3, this.modelSize, this.modelSize]
        );

    }

    async detectar() {

        if (!this.session)
            return [];

        const input = this.preprocessar();

        const resultado = await this.session.run({
            images: input
        });

        return this.processarSaida(
            resultado.output0
        );

    }

    processarSaida(output) {

        const dados = output.data;
        const dims = output.dims;

        const deteccoes = [];

        if (
            dims.length !== 3 ||
            dims[2] !== 6
        ) {

            console.warn(
                "Formato inesperado:",
                dims
            );

            return deteccoes;

        }

        const total = dims[1];

        for (let i = 0; i < total; i++) {

            const indice = i * 6;

            const x1 = dados[indice];
            const y1 = dados[indice + 1];

            const x2 = dados[indice + 2];
            const y2 = dados[indice + 3];

            const score = dados[indice + 4];

            const classeId = Math.round(
                dados[indice + 5]
            );

            if (
                score <
                this.confidenceThreshold
            ) {
                continue;
            }

            deteccoes.push({

                classeId,

                classe:
                    this.classes[classeId] ??
                    "Desconhecido",

                confianca: score,

                x: x1,

                y: y1,

                largura: x2 - x1,

                altura: y2 - y1

            });

        }

        return deteccoes;

    }

        desenharDeteccoes(canvas, deteccoes) {

    if (!canvas)
        return;

    const ctx = canvas.getContext("2d");

    canvas.width = this.source.videoWidth || this.source.width;
    canvas.height = this.source.videoHeight || this.source.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const escalaX = canvas.width / this.modelSize;
    const escalaY = canvas.height / this.modelSize;

    ctx.lineWidth = 3;
    ctx.font = "18px Arial";

    for (const obj of deteccoes) {

        const x = obj.x * escalaX;
        const y = obj.y * escalaY;
        const largura = obj.largura * escalaX;
        const altura = obj.altura * escalaY;

        ctx.strokeStyle = "#00ff00";

        ctx.strokeRect(
            x,
            y,
            largura,
            altura
        );

        const texto =
            `${obj.classe} ${(obj.confianca * 100).toFixed(1)}%`;

        const larguraTexto =
            ctx.measureText(texto).width;

        ctx.fillStyle = "#00ff00";

        ctx.fillRect(
            x,
            y - 24,
            larguraTexto + 10,
            24
        );

        ctx.fillStyle = "#000";

        ctx.fillText(
            texto,
            x + 5,
            y - 6
        );

    }

}
}

export async function iniciarDetector(source) {

    const detector = new DetectorManager(source);

    await detector.iniciar();

    return detector;

}