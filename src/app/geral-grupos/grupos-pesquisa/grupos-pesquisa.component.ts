import { Component, OnInit, ViewChild } from '@angular/core';

import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { GeralGruposService, GruposFiltro } from '../geral-grupos.service';

@Component({
  selector: 'app-grupos-pesquisa',
  templateUrl: './grupos-pesquisa.component.html',
  styleUrls: ['./grupos-pesquisa.component.css']
})
export class GruposPesquisaComponent implements OnInit { 

  totalRegistros = 0
  filtro = new GruposFiltro()
  grupos = []
  @ViewChild('tabela')  grid

  constructor(
    private geralGruposService: GeralGruposService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
    this.pesquisar()
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina

    this.geralGruposService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total
        this.grupos = resultado.grupos
      })
      .catch(erro => this.errorHandler.handle(erro))
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows
    this.pesquisar(pagina)
  }

  confirmarExclusao(grupo: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(grupo)
      }
    })
  }

  excluir(grupo: any) {
    this.geralGruposService.excluir(grupo.codigo)
      .then(() => {
        if (this.grid.first === 0 ) {
          this.pesquisar()
        } else {
          this.grid.first = 0
        }
        this.messageService.add(
          {severity:'success', summary:'Service Message', detail:'Grupo excluído com sucesso!'});
      })
      .catch(erro => this.errorHandler.handle(erro))
  }

 

}