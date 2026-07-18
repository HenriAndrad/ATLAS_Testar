const dictionary = {

    person: "Pessoa",
    people: "Pessoas",

    cellphone: "Celular",
    phone: "Telefone",
    smartphone: "Smartphone",

    laptop: "Notebook",
    computer: "Computador",
    keyboard: "Teclado",
    mouse: "Mouse",
    monitor: "Monitor",

    television: "Televisão",
    tv: "Televisão",
    remote: "Controle Remoto",

    book: "Livro",
    notebook: "Caderno",
    pen: "Caneta",
    pencil: "Lápis",
    eraser: "Borracha",
    ruler: "Régua",
    scissors: "Tesoura",

    backpack: "Mochila",
    bag: "Bolsa",

    chair: "Cadeira",
    table: "Mesa",
    desk: "Escrivaninha",
    sofa: "Sofá",
    bed: "Cama",
    pillow: "Travesseiro",

    door: "Porta",
    window: "Janela",

    bottle: "Garrafa",
    cup: "Copo",
    mug: "Caneca",
    bowl: "Tigela",
    plate: "Prato",
    spoon: "Colher",
    fork: "Garfo",
    knife: "Faca",

    apple: "Maçã",
    banana: "Banana",
    orange: "Laranja",
    lemon: "Limão",
    pizza: "Pizza",
    sandwich: "Sanduíche",
    hotdog: "Cachorro-quente",
    cake: "Bolo",
    donut: "Rosquinha",

    bicycle: "Bicicleta",
    motorcycle: "Moto",
    car: "Carro",
    bus: "Ônibus",
    truck: "Caminhão",
    train: "Trem",
    airplane: "Avião",
    boat: "Barco",

    traffic: "Trânsito",
    trafficlight: "Semáforo",
    stopsign: "Placa de Pare",

    dog: "Cachorro",
    cat: "Gato",
    bird: "Pássaro",
    horse: "Cavalo",
    sheep: "Ovelha",
    cow: "Vaca",
    elephant: "Elefante",
    bear: "Urso",
    zebra: "Zebra",
    giraffe: "Girafa",

    tree: "Árvore",
    flower: "Flor",
    grass: "Grama",

    clock: "Relógio",

    glasses: "Óculos",

    shoe: "Sapato",

    shirt: "Camisa",

    pants: "Calça",

    hat: "Chapéu"

};

const cache = new Map();

export function traduzirLocal(nome) {

    if (!nome) return "";

    const chave = nome.toLowerCase().trim();

    if (cache.has(chave)) {

        return cache.get(chave);

    }

    const traducao = dictionary[chave] || nome;

    cache.set(chave, traducao);

    return traducao;

}

export function adicionarTraducao(original, traducao) {

    if (!original || !traducao) return;

    const chave = original.toLowerCase().trim();

    dictionary[chave] = traducao;

    cache.set(chave, traducao);

}

export function existeTraducao(nome) {

    if (!nome) return false;

    return dictionary.hasOwnProperty(nome.toLowerCase().trim());

}

export function limparCache() {

    cache.clear();

}

export function totalTraducoes() {

    return Object.keys(dictionary).length;

}

export default dictionary;