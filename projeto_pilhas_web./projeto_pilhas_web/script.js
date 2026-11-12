// Classe simples para representar uma pilha (Stack).
class Pilha {
  constructor() {
    this.itens = [];
  }

  empilhar(valor) {
    this.itens.push(valor);
  }

  desempilhar() {
    return this.itens.pop();
  }

  estaVazia() {
    return this.itens.length === 0;
  }

  topo() {
    return this.itens[this.itens.length - 1];
  }

  limpar() {
    this.itens = [];
  }

  tamanho() {
    return this.itens.length;
  }
}

function mostrarPilha(elemento, pilha, formatar = (valor) => valor) {
  elemento.innerHTML = "";

  if (pilha.estaVazia()) {
    elemento.innerHTML = '<span class="vazio">Pilha vazia</span>';
    return;
  }

  // O último item do array representa o topo da pilha.
  [...pilha.itens].reverse().forEach((valor, indice) => {
    const item = document.createElement("span");
    item.className = "item-pilha" + (indice === 0 ? " topo-pilha" : "");
    item.textContent = formatar(valor);
    item.title = indice === 0 ? "Topo da pilha" : "Item da pilha";
    elemento.appendChild(item);
  });
}

// 1. Conversão de decimal para binário usando pilha.
const formBinario = document.getElementById("form-binario");
const campoDecimal = document.getElementById("decimal");
const resultadoBinario = document.getElementById("resultado-binario");
const visualPilhaBinario = document.getElementById("pilha-binario");

formBinario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const numero = Number(campoDecimal.value);

  if (!Number.isSafeInteger(numero) || numero < 0 || campoDecimal.value.trim() === "") {
    resultadoBinario.textContent = "Digite um número inteiro válido, igual ou maior que zero.";
    resultadoBinario.className = "resultado erro";
    return;
  }

  const pilha = new Pilha();
  let valor = numero;

  if (valor === 0) {
    pilha.empilhar(0);
  } else {
    while (valor > 0) {
      const resto = valor % 2;
      pilha.empilhar(resto);
      valor = Math.floor(valor / 2);
    }
  }

  let binario = "";
  while (!pilha.estaVazia()) {
    binario += pilha.desempilhar();
  }

  // Recria a pilha para mostrar os restos na tela, com o topo primeiro.
  let auxiliar = numero;
  if (auxiliar === 0) {
    pilha.empilhar(0);
  } else {
    while (auxiliar > 0) {
      pilha.empilhar(auxiliar % 2);
      auxiliar = Math.floor(auxiliar / 2);
    }
  }

  resultadoBinario.textContent = `${numero} em binário é ${binario}.`;
  resultadoBinario.className = "resultado sucesso";
  mostrarPilha(visualPilhaBinario, pilha);
});

// 2. Balanceamento de parênteses usando pilha.
const formParenteses = document.getElementById("form-parenteses");
const campoExpressao = document.getElementById("expressao");
const resultadoParenteses = document.getElementById("resultado-parenteses");
const visualPilhaParenteses = document.getElementById("pilha-parenteses");

formParenteses.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const expressao = campoExpressao.value;
  const pilha = new Pilha();
  let valido = true;

  for (const caractere of expressao) {
    if (caractere === "(") {
      pilha.empilhar(caractere);
    } else if (caractere === ")") {
      if (pilha.estaVazia()) {
        valido = false;
        break;
      }
      pilha.desempilhar();
    }
  }

  valido = valido && pilha.estaVazia();

  if (valido) {
    resultadoParenteses.textContent = "Expressão válida! Os parênteses estão balanceados.";
    resultadoParenteses.className = "resultado sucesso";
  } else {
    resultadoParenteses.textContent = "Expressão inválida! Os parênteses não estão balanceados.";
    resultadoParenteses.className = "resultado erro";
  }

  mostrarPilha(visualPilhaParenteses, pilha);
});

// 3. Histórico de edição com pilha (Ctrl + Z).
const campoTexto = document.getElementById("texto");
const botaoDesfazer = document.getElementById("desfazer");
const botaoLimpar = document.getElementById("limpar");
const resultadoHistorico = document.getElementById("resultado-historico");
const visualPilhaHistorico = document.getElementById("pilha-historico");

const historico = new Pilha();
let ultimoTexto = campoTexto.value;

campoTexto.addEventListener("input", () => {
  if (campoTexto.value !== ultimoTexto) {
    historico.empilhar(ultimoTexto);
    ultimoTexto = campoTexto.value;
    mostrarPilha(visualPilhaHistorico, historico, (texto) => {
      return texto.length > 24 ? texto.slice(0, 24) + "..." : (texto || "(vazio)");
    });
    resultadoHistorico.textContent = "Alteração salva no histórico.";
    resultadoHistorico.className = "resultado";
  }
});

function desfazerEdicao() {
  if (historico.estaVazia()) {
    resultadoHistorico.textContent = "Não há alterações anteriores para desfazer.";
    resultadoHistorico.className = "resultado erro";
    return;
  }

  campoTexto.value = historico.desempilhar();
  ultimoTexto = campoTexto.value;
  mostrarPilha(visualPilhaHistorico, historico, (texto) => {
    return texto.length > 24 ? texto.slice(0, 24) + "..." : (texto || "(vazio)");
  });
  resultadoHistorico.textContent = "Última alteração desfeita.";
  resultadoHistorico.className = "resultado sucesso";
}

botaoDesfazer.addEventListener("click", desfazerEdicao);

document.addEventListener("keydown", (evento) => {
  if ((evento.ctrlKey || evento.metaKey) && evento.key.toLowerCase() === "z") {
    evento.preventDefault();
    desfazerEdicao();
  }
});

botaoLimpar.addEventListener("click", () => {
  if (campoTexto.value !== "") {
    historico.empilhar(campoTexto.value);
    campoTexto.value = "";
    ultimoTexto = "";
    mostrarPilha(visualPilhaHistorico, historico, (texto) => {
      return texto.length > 24 ? texto.slice(0, 24) + "..." : (texto || "(vazio)");
    });
    resultadoHistorico.textContent = "Texto limpo. Você pode usar Desfazer para recuperar a versão anterior.";
    resultadoHistorico.className = "resultado sucesso";
  }
});
