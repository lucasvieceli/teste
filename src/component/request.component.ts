import {
    Component, Input, ElementRef, forwardRef, NgZone, Output, EventEmitter,
    TemplateRef, ViewChild, Renderer, OnDestroy
} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {Select} from './../common/select';
import {SelectService} from '../service/select.service';

@Component({
    selector    : 'select2-request',
    template: `
       
        <!--select simples-->
        <span [ngClass]="getClassGeral()" [tabindex]="tabIndex" dir="ltr" (focus)="abrir()" (click)="abrir()">
        <span class="selection">
            <!--simples-->
            <span class="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" [ngStyle]="styleItemSelecionado">
                <span class="select2-selection__rendered">
                    <span [hidden]="!data" (click)="limpar($event)" class="select2-selection__clear">×</span>
                    <span [hidden]="!data" [inner-template]="templateSelecionado || templateSelecionadoInterno" [item]="data"></span>
                    <span [hidden]="data" [innerHtml]="placeholder" class="select2-selection__placeholder"></span>

                </span>
                <span class="select2-selection__arrow" role="presentation">
                    <b role="presentation"></b>
                </span>
            </span>
        </span>
        <span class="dropdown-wrapper" aria-hidden="true"></span>
    </span>

        <!--quando clicar campo-->
        <div [hidden]="!aberto">
            <div class="select2-container select2-container--bootstrap select2-container--open">
                <div class="select2-dropdown select2-dropdown--below" dir="ltr" >
                    <div class="select2-search select2-search--dropdown">
                        <input (keyup)="keyup($event.target.value)" #campoBusca placeholder="Digite algo" autofocus class="select2-search__field" type="search" tabindex="0" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox">
                    </div>
                    <span class="select2-results" aria-expanded="true" aria-hidden="false">
                        <ul
                                class="select2-results__options"
                                role="tree"
                                infinite-scroll
                                scroll-distance="0,30"
                                (OnScrollMethod)="onScroll()"
                                style=" overflow: auto!important;"
                        >
                            <div [hidden]="exibirMensagemCaracteresMinimo">
                                <div [hidden]="valoresExibir.length == 0" >
                                    <!--<ng-template -->
                                            <!--*ngIf="templateLista"-->
                                            <!--[inner-template]="templateLista" -->
                                            <!--[item]="{valoresExibir: valoresExibir, component: this}"-->
                                    <!--&gt;-->
                                    <!--</ng-template>-->
                                    <!--<ng-template *ngIf="!templateLista">-->
                                      
                                    <!--</ng-template>-->
                                    <ng-template [inner-template]="templateLista || templateListaInterno" [item]="{component: this}">
                                        
                                    </ng-template>
    
                                </div>
                                
                                <li [hidden]="buscando || valoresExibir.length > 0" class="select2-results__option select2-results__message" aria-live="assertive">
                                    <ng-template  [inner-template]="templateSemResultado || templateSemResultadoInterno" [item]="{pesquisa:valorPesquisado}"></ng-template>
                                </li>
                                <li [hidden]="!buscando">
                                    <ng-template [inner-template]="templateBuscando || templateBuscandoInterno"></ng-template>
                                </li>
                            </div>
                            <li [hidden]="exibirMensagemCaracteresMinimo == false" class="select2-results__option select2-results__message">
                                Digite {{minimoCaracteres}} ou mais caracteres para realizar a busca
                            </li>
                        </ul>
                    </span>
                </div>
            </div>
        </div>



        <ng-template #templateSemResultadoInterno>
            Nenhum resultado encontrado
        </ng-template>
        <ng-template #templateResultadoInterno let-valor>
            {{valor[indiceNome]}}
        </ng-template>
        <ng-template #templateSelecionadoInterno let-valor>
        <span *ngIf="valor"  [ngStyle]="styleItemSelecionado">
            {{valor[indiceNome]}}
        </span>
        </ng-template>
        <ng-template #templateBuscandoInterno>
            <span class="fa fa-5x fa-refresh fa-spin" style=" width: auto;margin:auto 50% !important"></span>
        </ng-template>   
        <ng-template #templateListaInterno let-valor>
            <li 
                *ngFor="let item of valor.component.valoresExibir" 
                (click)="valor.component.selecionar(item)" class="select2-results__option" 
                highlight="select2-results__option--highlighted" 
                role="treeitem" 
                [attr.aria-selected]="((_value) && (item[valor.component.indiceId] == _value[valor.component.indiceId])) ? true : false"
                
            >
                <div [inner-template]="templateResultado || templateResultadoInterno" [item]="item"></div>
            </li>
        </ng-template>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RequestComponent),
            multi: true
        }
    ],
    host: {
        '(document:click)': 'clickForaComponent($event)',
        '(focus)': 'abrir()',
        '(blur)': 'fechar()',
    },
})
export class RequestComponent extends Select implements OnDestroy{

    @Input() name: any = '';
    @Input() classe: any = '';
    @Input() tabIndex                 : any;
    @Input() styleItemSelecionado     : any;
    @Input() minimoCaracteres         : number = 0;
    @Input() placeholder              : string = 'Selecione';
    @Input() templateResultado        : TemplateRef<any>;
    @Input() templateLista            : TemplateRef<any>;
    @Input() templateSelecionado      : TemplateRef<any>;
    @Input() templateSemResultado     : TemplateRef<any>;
    @Input() templateBuscando         : TemplateRef<any>;
    @Input() disabled                 : boolean = false;
    @Input() indiceId                 : string = 'id';
    @Input() indiceNome               : string = 'nome';
    @Input() url                      : string;

    @Output() change            = new EventEmitter<any>();
    @Output() onSelecionarItem  = new EventEmitter<any>();
    @Output() onBuscar          = new EventEmitter<any>();
    @Output() onApagar          = new EventEmitter<any>();
    @Output() onRemoverItem     = new EventEmitter<any>();
    @Output() onAbrir           = new EventEmitter<any>();
    @Output() onFechar          = new EventEmitter<any>();
    @Output() onLimpar          = new EventEmitter<any>();
    @Output() onErro            = new EventEmitter<any>();
    @Output() onProcessaResultado  = new EventEmitter<any>();
    @Output() onProcessaParametros = new EventEmitter<any>();
    @ViewChild('campoBusca') campoBusca : ElementRef;

    public pagina          : number = 1;
    public quantidadePadrao: number = 0;
    public buscando        : boolean = false;
    public semResultado    : boolean = false;
    public subscrebeBusca  : any;

    constructor(
        public elementRef   : ElementRef,
        public zone         : NgZone,
        public requisicao   : SelectService,
        public renderer     : Renderer
    ){
        super(elementRef, zone);
    }

    ngOnDestroy(){
        if(this.subscrebeBusca){
            this.subscrebeBusca.unsubscribe();
        }
    }

    
    abrir(){
        if(this.disabled){
            return false;
        }
        
        if(this.aberto) {
            this.fechar();
        }else{
            this.setFocus(true);
            this.aberto = true;

            // this.renderer.invokeElementMethod(this.campoBusca.nativeElement, 'focus', []);
            this.pagina             = 1;
            this.semResultado       = false;
            this.quantidadePadrao   = 0;
            this.valorPesquisado    = '';
            this.campoBusca.nativeElement.value = '';
            this.setFocus(true);
            this.onAbrir.emit(true);
            this.buscar();
        }
    }
    keyup(valor){
        if(this.valorPesquisado == valor){
            return null;
        }
        this.valoresExibir = [];
        this.valorPesquisado = valor;
        this.pagina = 1;
        this.buscar();
    }

    selecionar(item){
        this.data = item;

        super.selecionar(item);
    }
    limpar(event){
        event.stopPropagation();
        this.data = null;
        this.updateValue(null);
        this.onLimpar.emit(true);
        if(this.aberto){
            this.fechar()
        }else {
            this.abrir();
        }
    }

    buscar(){
        if(this.validaCaracteresMinimo() == false){
            return false;
        }

        this.buscando = true;

        // this.valoresExibir = this._valores.filter(item => item[this.indiceNome].indexOf(this.valorPesquisado) !== -1);
        let parametros = {
            enviado : {
                pagina: this.pagina,
                valorPesquisado: this.valorPesquisado,
            },
            retorno: {}
        };

        //mata o subscribe
        this.ngOnDestroy();
        this.onBuscar.emit(this.valorPesquisado);
        this.onProcessaParametros.emit(parametros);
        this.subscrebeBusca = this.requisicao.getResultados(this.url, parametros.retorno).subscribe(
            resultado =>{
                let objEmit = {enviado : resultado,retorno: []};
                this.onProcessaResultado.emit(objEmit);
                let exibirResultado = objEmit.retorno;

                if(Array.isArray(exibirResultado)) {
                    if (this.quantidadePadrao == 0) {
                        this.quantidadePadrao = exibirResultado.length;
                    }

                    if (this.quantidadePadrao != exibirResultado.length) {
                        this.semResultado = true;
                    }

                    this.valoresExibir = this.valoresExibir.concat(exibirResultado);
                }else{
                    console.log('Ng2Select2Bootstrap: retorno não é um select', exibirResultado);
                }
                this.buscando = false;
            },
            erro =>{
                console.log(erro);
                this.onErro.emit(erro);
                this.buscando = false;
        
            }
        );
    }

    onScroll(){
        if(!this.buscando && !this.semResultado) {
            this.pagina++;
            this.buscar();
        }
    }

    get value(): any { return this._value; };
    @Input() set value(v) {
        if (v !== this._value) {
            this._value = v;
            this._onChangeCallback(v);
        }
    }



    
    


}