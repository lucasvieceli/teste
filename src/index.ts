import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MultipleComponent} from './component/multiple.component';
import {RequestComponent} from './component/request.component';
import {RequestMultipleComponent} from './component/request-multiple.component';
import {SelectComponent} from './component/select.component';
import {HighlightDirective} from './directive/highlight.directive';
import {InfiniteScrollDirective} from './directive/infinite-scroll.directive';
import {InnerTemplateDirective} from './directive/inner-template.directive';
import {SelectService} from './service/select.service';

export {MultipleComponent} from './component/multiple.component';
export {RequestComponent} from './component/request.component';
export {RequestMultipleComponent} from './component/request-multiple.component';
export {SelectComponent} from './component/select.component';
export {Select} from './common/select';
export {HighlightDirective} from './directive/highlight.directive';
export {InfiniteScrollDirective} from './directive/infinite-scroll.directive';
export {InnerTemplateDirective} from './directive/inner-template.directive';
export {SelectService} from './service/select.service';

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