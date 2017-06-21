import {
    Component, Input, ElementRef,  forwardRef, NgZone, Output, EventEmitter,
    TemplateRef,  ViewChild
} from '@angular/core';
import {Select} from './../common/select';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector    : 'select2-multiple',
    templateUrl : 'multiple.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultipleComponent),
            multi: true
        }
    ],
    host: {
        '(document:click)': 'clickForaComponent($event)',
        '(focus)': 'setFocus(true)',
        '(blur)': 'setFocus(false)',
    },
})
export class MultipleComponent extends Select implements ControlValueAccessor{


    @Input() name                     : any = '';
    @Input() classe                   : any = '';
    @Input() placeholder              : string = 'Selecione';
    @Input() minimoCaracteres         : number = 0;
    @Input() templateResultado        : TemplateRef<any>;
    @Input() templateSelecionado      : TemplateRef<any>;
    @Input() templateSemResultado     : TemplateRef<any>;
    @Input() disabled                 : boolean = false;
    @Input() indiceId                 : string = 'id';
    @Input() indiceNome               : string = 'nome';
    @Input() set valores(valor : any){
        this._valores = valor;
        this.valoresExibir = valor;
    }
    @Output() change            = new EventEmitter<any>();
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
            if(!this.data){this.data = []}
            if(!this._value){this._value = []}
            this.valorPesquisado    = '';
            this.campoBusca.nativeElement.focus();
            this.setFocus(true);
            this.onAbrir.emit(true);
            this.buscar();
        }
    }

    selecionar(item){
        //verifica se ja foi adicionado
        let jaExiste = this.data.findIndex(procurar => procurar[this.indiceId] == item[this.indiceId]);
        if(jaExiste === -1) {
            this.data.push(item);
        }
        this.updateValue(this.data);

        this.onSelecionarItem.emit(item);
        this.fechar();

        //apaga campo de busca
        this.campoBusca.nativeElement.value = '';
    }

    getSomenteId(){
        let ids = [];
        for(let item of this.data){
            ids.push(item[this.indiceId]);
        }

        return ids;
    }

    limpar(event){
        event.stopPropagation();
        this.data = null;
        this.updateValue(null);
        this.onLimpar.emit(true);
        this.aberto = false;
        this.abrir();
    }
    remove(item, event){
        super.remove(item, event);
        this.updateValue(this.data);
    }

    buscar(){
        if(this.validaCaracteresMinimo() == false){
            return false;
        }
        
        this.onBuscar.emit(this.valorPesquisado);
        this.valoresExibir = this._valores.filter(item => {
            let pesquisa = item[this.indiceNome].toString().toLocaleLowerCase().indexOf(this.valorPesquisado.toString().toLocaleLowerCase());
            //verifica se o item da lista original ja n esta add na lista data
            let jaFoiAdicionado = this.data.findIndex(procurar => procurar[this.indiceId] == item[this.indiceId]);
            if (pesquisa !== -1 && jaFoiAdicionado === -1) {
                return item;
            }
        });
    }



    get value(): any { return this._value; };
    @Input() set value(v) {
        if (v !== this._value) {
            this._value = (v);
            this._onChangeCallback(v);
        }
    }

    

    
    
    
    writeValue(value: any): void {
        this.data = value;
        this._value = value;
    }
    updateValue (value: any) {
        this.zone.run(() => {
            this._value = value;

            this.onChange(value);
            this._onTouchedCallback();
            this.change.emit(value);


        });
    }
    
    onChange (_: any) {}
    onTouched () {}
    registerOnChange (fn: any) { this.onChange = fn; }
    registerOnTouched (fn: any) { this.onTouched = fn; }
    _onChangeCallback (_: any) {}
    _onTouchedCallback () {}

}