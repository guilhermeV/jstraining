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

}
