// Models/cursoDAO.js
import Curso from "./curso.js";

export default class CursoDAO {
  async gravar(curso) {
    await curso.gravar();
  }

  async atualizar(curso) {
    await curso.atualizar();
  }

  async excluir(curso) {
    await curso.excluir();
  }

  async listar() {
    return await Curso.listar();
  }

  async consultarPorId(id) {
    return await Curso.consultarPorId(id);
  }
}
