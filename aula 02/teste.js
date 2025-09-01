import readline from "readline";
import Curso from "./Models/curso.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function perguntar(pergunta) {
  return new Promise((resolve) => rl.question(pergunta, resolve));
}

async function perguntarNumero(mensagem, isFloat = false) {
  let valor;
  do {
    const resposta = await perguntar(mensagem);
    valor = isFloat ? parseFloat(resposta) : parseInt(resposta);

    if (isNaN(valor)) console.log("❌ Valor inválido! Digite um número válido.");
  } while (isNaN(valor));

  return valor;
}

async function main() {
  console.log("===== Sistema de Cursos =====");

  let opcao;
  do {
    console.log(`
1 - Cadastrar curso
2 - Listar cursos
3 - Atualizar curso
4 - Excluir curso
0 - Sair
    `);

    opcao = await perguntar("Escolha uma opção: ");

    switch (opcao) {
      case "1": {
        const nome = await perguntar("Digite o nome do curso: ");
        const descricao = await perguntar("Digite a descrição: ");
        const preco = await perguntarNumero("Digite o preço do curso: ", true);
        const carga_horaria = await perguntarNumero("Digite a carga horária: ");
        const professor = await perguntar("Digite o professor: ");

        const curso = new Curso(0, nome, descricao, preco, carga_horaria, professor);
        await curso.gravar();
        console.log(`Curso gravado com sucesso! ID: ${curso.id}`);
        break;
      }

      case "2": {
        const cursos = await Curso.listar();
        console.log("Lista de Cursos:");
        cursos.forEach((c) => {
          console.log(`${c.id} - ${c.nome} | ${c.professor} | R$${c.preco} | ${c.carga_horaria}h`);
        });
        break;
      }

      case "3": {
        const id = await perguntarNumero("Digite o ID do curso a atualizar: ");
        const nome = await perguntar("Digite o novo nome: ");
        const descricao = await perguntar("Digite a nova descrição: ");
        const preco = await perguntarNumero("Digite o novo preço: ", true);
        const carga_horaria = await perguntarNumero("Digite a nova carga horária: ");
        const professor = await perguntar("Digite o novo professor: ");

        const curso = new Curso(id, nome, descricao, preco, carga_horaria, professor);
        await curso.atualizar();
        console.log("Curso atualizado com sucesso!");
        break;
      }

      case "4": {
        const id = await perguntarNumero("Digite o ID do curso a excluir: ");
        const curso = new Curso(id);
        await curso.excluir();
        console.log("Curso excluído com sucesso!");
        break;
      }

      case "0":
        console.log("Saindo...");
        break;

      default:
        console.log("Opção inválida!");
    }
  } while (opcao !== "0");

  rl.close();
}

main();
