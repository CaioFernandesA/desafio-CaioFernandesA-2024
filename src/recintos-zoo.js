class RecintosZoo {
  constructor() {
    this.recintos = [
      { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
      { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
      { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
      { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
      { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
    ];

    this.animais = {
      'LEAO': { tamanho: 3, biomas: ['savana'], carnivoro: true },
      'LEOPARDO': { tamanho: 2, biomas: ['savana'], carnivoro: true },
      'CROCODILO': { tamanho: 3, biomas: ['rio'], carnivoro: true },
      'MACACO': { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
      'GAZELA': { tamanho: 2, biomas: ['savana'], carnivoro: false },
      'HIPOPOTAMO': { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
    };
  }

  analisaRecintos(especie, quantidade) {
    
    if (!this.animais[especie]) return { erro: "Animal inválido" };
    if (!Number.isInteger(quantidade) || quantidade <= 0) return { erro: "Quantidade inválida" };

    const animal = this.animais[especie];
    const recintosViaveis = [];

    
    for (const recinto of this.recintos) {
      const biomaValido = animal.biomas.includes(recinto.bioma) || (animal.biomas.length === 2 && recinto.bioma === 'savana e rio');
      if (!biomaValido) continue;

      const carnivoroRecinto = recinto.animais.some(a => this.animais[a.especie].carnivoro);
      if (animal.carnivoro && (carnivoroRecinto || recinto.animais.length > 0)) continue;
      if (carnivoroRecinto && !animal.carnivoro) continue;

      const hipopotamoPresent = recinto.animais.some(a => a.especie === 'HIPOPOTAMO');
      if (hipopotamoPresent && !['savana e rio'].includes(recinto.bioma)) continue;
      if (especie === 'HIPOPOTAMO' && recinto.animais.length > 0 && recinto.bioma !== 'savana e rio') continue;

      const espacoOcupado = recinto.animais.reduce((acc, a) => acc + this.animais[a.especie].tamanho * a.quantidade, 0);
      const espacoNecessario = (recinto.animais.length > 0 ? 1 : 0) + animal.tamanho * quantidade;

      if (espacoOcupado + espacoNecessario > recinto.tamanhoTotal) continue;
      if (especie === 'MACACO' && recinto.animais.length === 0) continue;

      const espacoLivre = recinto.tamanhoTotal - espacoOcupado - espacoNecessario;
      recintosViaveis.push({ numero: recinto.numero, espacoLivre, tamanhoTotal: recinto.tamanhoTotal });
    }

    if (recintosViaveis.length === 0) return { erro: "Não há recinto viável" };

    recintosViaveis.sort((a, b) => a.numero - b.numero);

    return {
      recintosViaveis: recintosViaveis.map(
        r => `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.tamanhoTotal})`
      )
    };
  }
}


export { RecintosZoo as RecintosZoo };
