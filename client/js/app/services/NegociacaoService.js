class NegociacaoService {

  constructor() {
    this._http = new HttpService();
  }

  obterNegociacoes() {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.obterNegociacoesDaSemana(),
        this.obterNegociacoesDaSemanaAnterior(),
        this.obterNegociacoesDaSemanaRetrasada()
      ]).then(negociacioes => {
        resolve(negociacioes.reduce((arrayAchatado, array) => arrayAchatado.concat(array), []));
      }).catch(error => reject(error));
    });
  }

  obterNegociacoesDaSemana() {
    return this._http.get('/negociacoes/semana').then(negociacoes => {
      return negociacoes.map(negociacao => new Negociacao(new Date(negociacao.data), negociacao.quantidade, negociacao.valor));
    }).catch(erro => {
      console.log(erro);
      throw new Error('Não foi possível obter as negociações da semana');
    });
  }

  obterNegociacoesDaSemanaRetrasada() {
    return this._http.get('/negociacoes/retrasada').then(negociacoes => {
      return negociacoes.map(negociacao => new Negociacao(new Date(negociacao.data), negociacao.quantidade, negociacao.valor));
    }).catch(erro => {
      console.log(erro);
      throw new Error('Não foi possível obter as negociações da semana retrasada');
    });
  }

  obterNegociacoesDaSemanaAnterior() {
    return this._http.get('/negociacoes/anterior').then(negociacoes => {
      return negociacoes.map(negociacao => new Negociacao(new Date(negociacao.data), negociacao.quantidade, negociacao.valor));
    }).catch(erro => {
      console.log(erro);
      throw new Error('Não foi possível obter as negociações da semana anterior');
    });
  }

  cadastra(negociacao) {
    return ConnectionFactory.getConnection()
        .then(connection => new NegociacaoDao(connection))
        .then(dao => dao.adiciona(negociacao))
        .then(() => 'Negociação adicionada com sucesso')
        .catch(erro => {
          console.log(erro);
          throw new Error('Não foi possível adicionar a negociação')
        });
  }

  lista() {
    return ConnectionFactory.getConnection()
        .then(connection => new NegociacaoDao(connection))
        .then(dao => dao.listaTodos())
        .catch(erro => {
          console.log(erro);
          throw new Error('Não foi possível obter as negociações')
        });
  }

  apaga() {
    return ConnectionFactory
        .getConnection()
        .then(connection => new NegociacaoDao(connection))
        .then(dao => dao.apagaTodos())
        .then(() => 'Negociações apagadas com sucesso')
        .catch(erro => {
          console.log(erro);
          throw new Error('Não foi possível apagar as negociações')
        });
  }

  importa(listaAtual) {
    return this.obterNegociacoes()
        .then(negociacoes => negociacoes.filter(negociacao =>
            !listaAtual.some(negociacaoExistente => JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente)))
        )
        .catch(erro => {
          console.log(erro);
          throw new Error('Não foi possível buscar negociações para importar')
        });
  }

}
