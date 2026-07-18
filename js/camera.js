let video = null;

class CameraManager {

    constructor() {

        this.stream = null;
        this.devices = [];
        this.currentCamera = 0;

        this.video = document.getElementById("camera");

    }

    async iniciar() {

        await this.buscarCameras();

        await this.abrirCamera(this.currentCamera);

        return this;

    }

    async buscarCameras() {

        const permissao = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        permissao.getTracks().forEach(track => track.stop());

        const dispositivos = await navigator.mediaDevices.enumerateDevices();

        this.devices = dispositivos.filter(device => device.kind === "videoinput");

    }

    async abrirCamera(indice) {

        if (this.stream) {

            this.stream.getTracks().forEach(track => track.stop());

        }

        const camera = this.devices[indice];

        this.stream = await navigator.mediaDevices.getUserMedia({

            audio: false,

            video: {

                deviceId: camera.deviceId,

                width: {
                    ideal: 1280
                },

                height: {
                    ideal: 720
                },

                facingMode: "environment"

            }

        });

        this.video.srcObject = this.stream;

        await this.video.play();

    }

    async trocarCamera() {

        if (this.devices.length <= 1) return;

        this.currentCamera++;

        if (this.currentCamera >= this.devices.length) {

            this.currentCamera = 0;

        }

        await this.abrirCamera(this.currentCamera);

    }

    congelar() {

        this.video.pause();

    }

    continuar() {

        this.video.play();

    }

    getVideo() {

        return this.video;

    }

    getStream() {

        return this.stream;

    }

    getWidth() {

        return this.video.videoWidth;

    }

    getHeight() {

        return this.video.videoHeight;

    }

}

export async function iniciarCamera() {

    const camera = new CameraManager();

    return await camera.iniciar();

}