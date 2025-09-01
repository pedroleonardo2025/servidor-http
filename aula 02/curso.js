import sql from "../conexao.js";

class Curso {
  constructor(id = 0, nome = "", descricao = "", preco = 0, carga_horaria = 0, professor = "") {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
    this.carga_horaria = carga_horaria;
    this.professor = professor;
  }

  // Gravar novo curso
  async gravar() {
    const result = await sql`
      INSERT INTO cursos (nome, descricao, preco, carga_horaria, professor)
      VALUES (${this.nome}, ${this.descricao}, ${this.preco}, ${this.carga_horaria}, ${this.professor})
      RETURNING id
    `;
    this.id = result[0].id;
  }

  // Listar todos os cursos
  static async listar() {
    const result = await sql`SELECT * FROM cursos ORDER BY id`;
    return result;
  }

  // Atualizar curso
  async atualizar() {
    await sql`
      UPDATE cursos
      SET nome = ${this.nome},
          descricao = ${this.descricao},
          preco = ${this.preco},
          carga_horaria = ${this.carga_horaria},
          professor = ${this.professor}
      WHERE id = ${this.id}
    `;
  }

  // Excluir curso
  async excluir() {
    await sql`DELETE FROM cursos WHERE id = ${this.id}`;
  }
}

export default Curso;
