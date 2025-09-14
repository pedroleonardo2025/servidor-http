import Curso from "../Models/Curso.js";

export default class CursoController {

    // HTTP POST - criar curso
    gravar(requisicao, resposta) {
        if (requisicao.method === "POST" && requisicao.is("application/json")) {
            const dados = requisicao.body;
            if (dados.nome && dados.descricao && dados.preco && dados.carga_horaria && dados.professor) {
                const curso = new Curso(0, dados.nome, dados.descricao, dados.preco, dados.carga_horaria, dados.professor);
                curso.gravar()
                    .then(() => {
                        resposta.status(200).json({
                            status: true,
                            mensagem: "Curso gravado com sucesso"
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            status: false,
                            mensagem: "Erro ao gravar o curso: " + erro.message
                        });
                    });
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe todos os dados do curso (Nome, Descrição, Preço, Carga Horária e Professor)"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida"
            });
        }
    }

    // HTTP PUT - atualizar curso
    alterar(requisicao, resposta) {
        if ((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const id = requisicao.params.id; // id do curso informado na URL

            if (id && dados.nome && dados.descricao && dados.preco && dados.carga_horaria && dados.professor) {
                const curso = new Curso(id, dados.nome, dados.descricao, dados.preco, dados.carga_horaria, dados.professor);
                curso.alterar()
                    .then(() => {
                        resposta.status(200).json({
                            status: true,
                            mensagem: "Curso atualizado com sucesso"
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            status: false,
                            mensagem: "Erro ao atualizar o curso: " + erro.message
                        });
                    });
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe todos os dados do curso (Nome, Descrição, Preço, Carga Horária e Professor). O id deve ser informado na URL."
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida"
            });
        }
    }

    // HTTP DELETE - excluir curso
    excluir(requisicao, resposta) { 
        if (requisicao.method === "DELETE"){
            const id = requisicao.params.id;
            if (id){
                const curso = new Curso();
                curso.consultarPorId(id)
                .then((listaCursos) => {
                    const curso = listaCursos[0];
                    if (curso){
                        curso.excluir()
                        .then(() => {
                            resposta.status(200).json({
                                status: true,
                                mensagem: "Curso excluído com sucesso"
                            });
                        })
                        .catch((erro) => {
                            resposta.status(500).json({
                                status: false,
                                mensagem: "Erro ao excluir o curso: " + erro.message
                            });
                        });
                    }
                    else{
                        resposta.status(404).json({
                            status: false,
                            mensagem:"Curso não encontrado"
                        });
                    }
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao consultar o curso para exclusão: " + erro.message
                    });
                });
            }
            else{
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o ID do curso"
                });
            }

        } else{
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida"
            });
        }
    }

    // HTTP GET - consultar curso(s)
    consultar(requisicao, resposta) { 
        if (requisicao.method === "GET"){
            const id = requisicao.params.id;
            const curso = new Curso();
            if (id){
                curso.consultarPorId(id)
                .then((listaCursos)=>{
                    if (listaCursos.length > 0) {
                        resposta.status(200).json({
                            status:true,
                            mensagem: "Consulta realizada com sucesso",
                            cursos: listaCursos
                        });
                    } else{
                        resposta.status(404).json({
                            status: false,
                            mensagem:"Curso não encontrado"
                        });
                    }
                })
                .catch((erro)=>{
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao consultar o curso: " + erro.message
                    });
                });
            } else{
                curso.consultar()
                .then((listaCursos)=>{
                    resposta.status(200).json({
                        status:true,
                        mensagem: "Consulta realizada com sucesso",
                        cursos: listaCursos
                    });
                })
                .catch((erro)=>{
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao consultar os cursos: " + erro.message
                    });
                });
            }

        } else{
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida"
            });
        }

    }
}