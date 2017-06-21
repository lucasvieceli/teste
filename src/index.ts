import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {
    SelectComponent,
    MultipleComponent,
    RequestComponent,
    RequestMultipleComponent
} from './component';
import {InnerTemplateDirective, HighlightDirective, InfiniteScrollDirective} from './directive';
import {SelectService} from './service';

export * from './component/index';
export * from './common/index';
export * from './directive/index';
export * from './service/index';

@NgModule({
  imports     : [
    CommonModule,
    FormsModule,
  ],
  exports     : [
    InnerTemplateDirective,
    SelectComponent,
    MultipleComponent,
    RequestComponent,
    RequestMultipleComponent,
    FormsModule,
  ],
  declarations: [
    InnerTemplateDirective,
    SelectComponent,
    MultipleComponent,
    RequestComponent,
    HighlightDirective,
    RequestMultipleComponent,
    InfiniteScrollDirective,
  ],
  providers: [SelectService]
})
export class Ng2Select2BootstrapModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: Ng2Select2BootstrapModule,
      providers: [SelectService]
    };
  }
}