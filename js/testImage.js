export async function carregarImagemTeste() {

    return new Promise((resolve, reject) => {

        const img = new Image();

        img.src = "./assets/test/teste.jpg";

        img.onload = () => resolve(img);

        img.onerror = reject;

    });

}