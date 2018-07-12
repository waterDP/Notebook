/*** template(模板) ***/

// 取路由中的查询
let params = this.router.routerState.snapshot.queryParams;

/*style带单位绑定*/
  `<label [style.font-size.px]="size">FontSize: {{size}}px</label>`
  private size: number | string



  /*** NgModule(模块) ***/  
  @NgModule({ 
    declarations: [],  // 声明本模块中拥有的视图类。Angular 有三种视图类：组件、指令和管道。
    imports: [], // 本模块声明的组件模板需要的类所在的其它模块。必须导入的是模块类
    exports: [],  // declarations 的子集，可用于其它模块的组件模板。
    providers: [], // 服务的创建者，并加入到全局服务列表中，可用于应用任何部分。
    bootstrap: [] // 指定应用的主视图（称为根组件），它是所有其它视图的宿主。只有根模块才能设置bootstrap属性
  });

/*
  我应该把哪些类加到declarations中？
  把可声明的类（组件、指令和管道）添加到declarations列表中。
  这些类只能在应用程序的一个并且只有一个模块中声明。 只有当它们从属于某个模块时，才能把在此模块中声明它们。
  */

//我们通过引导根模块来启动应用。 在开发期间，你通常在一个main.ts文件中引导AppModule，就像这样：
/*main.ts*/
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);


/*** Directive(指令) ***/
结构型指令: *ngIf, *ngFor
属性 (attribute) 型指令: [(ngModel)]

内置属性型指令 
NgClass - 添加或移除一组CSS类  [ngClass]={className: boolean, ...}
NgStyle - 添加或移除一组CSS样式 [ngStyle]={styleName: value, ...}
NgModel - 双向绑定到HTML表单元素 [(ngModel)]

  /**html
    <input  [ngModel]="currentHero.name"
            (ngModelChange)="setUppercaseName($event)"
    >
    */

  NgSwitch
  /**html
    <div [ngSwitch]="currentHero.emotion">
      <happy-hero    *ngSwitchCase="'happy'"    [hero]="currentHero"></happy-hero>
      <sad-hero      *ngSwitchCase="'sad'"      [hero]="currentHero"></sad-hero>
      <confused-hero *ngSwitchCase="'confused'" [hero]="currentHero"></confused-hero>
      <unknown-hero  *ngSwitchDefault           [hero]="currentHero"></unknown-hero>
    </div>
    */

    /*一个属性指令*/
    import { Directive, ElementRef } from '@angular/core';

    @Directive({ selector: '[highlight]' })
    /** Highlight the attached element in gold */
    export class HighlightDirective {
      constructor(el: ElementRef) {
        el.nativeElement.style.backgroundColor = 'gold';
        console.log(`* AppRoot highlight called for ${el.nativeElement.tagName}`);
      }
    }

    /*写一个结构指令*/
    /* template*/
    `
      <p *myUnless="condition" class="unless a">
        (A) This paragraph is displayed because the condition is false.
      </p>

      <p *myUnless="!condition" class="unless b">
        (B) Although the condition is true,
        this paragraph is displayed because myUnless is set to false.
      </p>
    `

    /*Directive*/
    import { Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

    @Directive({ selector: '[myUnless]'})
    export class UnlessDirective {
      private hasView = false;

      constructor(private templateRef: TemplateRef<any>,
                  private viewContainer: ViewContainerRef){

      }

      @Input() set myUnless(condition: boolean) {
        if (!condition && !this.hasView) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView = true;
        } else if (condition && this.hasView) {
          this.viewContainer.clear();
          this.hasView = false;
        }
      }

    }

    /*** Pipe(管道) ***/
    import { Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'translate', pure: false})  //非纯管道

@pipe({
  name: 'pipeName'
})
export class PipeClass implements PipeTransform {
  transform(value: string, ...params) {

    return resultValue;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
 */
@Pipe({name: 'exponentialStrength'})
export class ExponentialStrengthPipe implements PipeTransform {
  transform(value: number, exponent: string): number {
    let exp = parseFloat(exponent);
    return Math.pow(value, isNaN(exp) ? 1 : exp);
  }
}

/*html
  <h2>Power Booster</h2>
  <p>Super power boost: {{2 | exponentialStrength: 10}}</p>
  */

=>内置管道
  >> AsyncPipe
  import { AyncPipe } from '@angular/common';
  @Component({
    selecter: 'async-promise-pipe',
    template: `
      <div>
        <code>promise|async</code>
        <button (click)='clicked()'>{{arrived ? 'Reset' : 'Resolve'}}</button>
        <span>Wait for it ... {{greeting | async}}</span>
      </div>
    `
  })
  export class AsyncPromisePipeComponent {
    greeting: Promise<string> | null = null;
    arrived: boolean = false;

    private resolve: Function|null = null;

    constructor() {this.reset()};

    reset() {
      this.arrived = false;
      this.greeting = new Promise<string>((resolve, rejected) => {this.resolve = resolve;});
    }

    clicked() {
      if (this.arrived) {
        this.reset();
      } else {
        this.resolve !('hi there');
        this.arrived = true;
      }
    }
  }

  import { Observale } from 'rxjs/Observable';

  @Component({
    selecter: 'async-observable-pipe',
    template: `<div><code>observable|async</code>: Time: {{time | async}}</div>`
  })

  export class AsyncObsevablePipeComponent {
    time = new Observale<string>((observer: Subscribe<string>) => {
      setInterval(() => obsever.next(new Date().toString()), 1000);
    });
  };

  /*** 生命周期 ***/
  // constructor
  ngOnChanges
  ngOnInit
  ngDoCheck  //脏值检查
  ngAfterContentInit
  ngAfterContentChecked
  ngAfterVeiwInit
  ngAfterVeiwChecked
  ngOnDestroy


  /*** 常用模块 ***/
  import {HttpClientModule} from '@angular/common/http';
  HttpClientModule: 

  /*** 动态组件 ***/
  import { Directive, ViewContainerRef} from '@angular/core';

  @Directive({
    selector: '[ad-host]'
  })

  export class AdDirective {
    constructor(public viewContainerRef: ViewContainerRef) {

    }
  }

/*template  ad-banner.component.html
  <div class="ad-banner">
    <h3>Advertisements</h3>
    <ng-template ad-host></ng-template>
  </div>
  */

  /*ts ad-banner.component.html*/

  import { ComponentFactoryResolver } from '@angular/core';

  export class AdBannerComponent implements AfterViewInit, OnDestroy {
    @Input() ads: Aditem[];
    private currentAddIndex: number = -1;
    @ViewChild(AdDirective) adHost: AdDirective;
    private subscription: any;
    private interval: any;

    constructor(private componentFactoryResolve: ComponentFactoryResolve){

    }

    ngAfterViewInit() {
      this.loadComponent();
      this.getAds();
    }

    ngDestory() {
      clearInterval(this.interval);
    }

    private getAds() {
      this.interval = setInterval(()=>{
        this.loadComponent();
      },4000)
    }

    private loadComponent() {
      this.currentAddInde = (this.currentAddIndex + 1) % this.ads.length;
      let adItem = this.ads[this.currentAddInde];

      let componentFactory = this.componentFactoryResolve.resolveComponentFactory(adItem.component);

      let viewContainerRef = this.adHost.viewContainerRef;
      viewContainerRef.clear();

      let componentRef = viewContainerRef.createComponent(componentFactory);
      (<AdComponent>componentRef.instance).data = adItem.data;

    }

  }

// 通常，Angular编译器会为模板中所引用的每个组件都生成一个ComponentFactory类。 
// 但是，对于动态加载的组件，模板中不会出现对它们的选择器的引用。

// 要想确保编译器照常生成工厂类，就要把这些动态加载的组件添加到NgModule的entryComponents数组中：

// src/app/app.module.ts (entry components)
// entryComponents: [ HeroJobAdComponent, HeroProfileComponent ],


/*** animation(动画) ***/

/*app.module.ts(@NgModule import except)*/
import {NgModule} from '@angular/core';
import {BrowserModule from '@angular/platform-browse';
import {BrowserAnmationsModule} from '@angular/platform-browse/anmations';

/*hero-list-basic.component.ts*/
import {Component, Input} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'hero-list-basic',
  template: `
    <ul>
      <li *ngIf='let hero of heros'
          [@heroState]="hero.state"
          (click)="hero.toggleState()"
      ></li>
    </ul>
  `,
  animations: [
  trigger('heroState', [
    state('inactive', style({
      backgroundColor: '#eee',
      transform: 'scale(1)'
    })),
    state('active', style({
      backgroundColor: '#cfd8dc',
      transform: 'scale(1.1)'
    })),
    transition('inactive => active', animate('100ms ease-in')),
    transition('active => inactive', animate('100ms ease-in')),

      //transition('inaction <=> active', animate('100ms ease-out'))
      ])
  ]
})

export class HeroListBasiceComponent {
  @Input() heroList: Array<Object>;
}


=> 路由监听
export class BlazeTesterComponent implements OnInit{

  private isShowWelcome: boolean = false;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe(() => {
      if (this.router.url === '/ops-system/blaze-tester') {
        this.isShowWelcome = true;
      } else {
        this.isShowWelcome = false;
      }
    });
  }

}
