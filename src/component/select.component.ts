import {
    Component, Input, ElementRef,  forwardRef, NgZone, Output, EventEmitter,
    TemplateRef,  ViewChild
} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {Select} from './../common/select';

@Component({
    selector    : 'select2-select',
    templateUrl : 'select.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true
        }
    ],
    host: {
        '(document:click)': 'clickForaComponent($event)',
        '(focus)': 'setFocus(true)',
        '(blur)': 'setFocus(false)',
    },
})
export class SelectComponent extends Select{


    @Input() name                     : string = '';
    @Input() classe                   : string = '';
    @Input() placeholder              : string = 'Selecione';
    @Input() minimoCaracteres         : number = 0;
    @Input() templateResultado        : TemplateRef<any>;
    @Input() templateSelecionado      : TemplateRef<any>;
    @Input() templateSemResultado     : TemplateRef<any>;
    @Input() indiceId                 : string = 'id';
    @Input() indiceNome               : string = 'nome';
    @Input() disabled                 : boolean = false;
    @Input() set valores(valor : any){
        this._valores = valor;
        this.valoresExibir = valor;
    }
    // @Output() change            = new EventEmitter<any>();
    @Output() onSelecionarItem  = new EventEmitter<any>();
    @Output() onBuscar          = new EventEmitter<any>();
    @Output() onApagar          = new EventEmitter<any>();
    @Output() onRemoverItem     = new EventEmitter<any>();
    @Output() onAbrir           = new EventEmitter<any>();
    @Output() onFechar          = new EventEmitter<any>();
    @Output() onLimpar          = new EventEmitter<any>();
    @ViewChild('campoBusca') campoBusca : ElementRef;

    constructor(
        public elementRef   : ElementRef,
        public zone         : NgZone
    ){
        super(elementRef, zone);
    }

    
    abrir(){
        if(this.disabled){
            return false;
        }
        
        if(this.aberto) {
            this.fechar();
        }else{
            this.aberto = true;
            this.campoBusca.nativeElement.focus();
            this.valorPesquisado    = '';
            this.campoBusca.nativeElement.value = '';
            this.setFocus(true);
            this.onAbrir.emit(true);
            this.buscar();
        }
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

        this.onBuscar.emit(this.valorPesquisado);
        this.valoresExibir = this._valores.filter(item => item[this.indiceNome].toString().toLocaleLowerCase().indexOf(this.valorPesquisado.toString().toLocaleLowerCase()) !== -1);
    }



    get value(): any { return this._value; };
    @Input() set value(v) {
        if (v !== this._value) {
            this._value = v;
            this._onChangeCallback(v);
        }
    }

    

    
    


}