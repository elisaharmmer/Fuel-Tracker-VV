'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Aplicação Web - Fuel Tracker VV</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-5a1db6aad6d9c0c016436eeb18d232e42bc2f7af0fe338d9f06c45489e0e21ba9749a966e5a9e65952877ab9c4839ffbfca376fda41d80c55bb87071cb05594a"' : 'data-bs-target="#xs-components-links-module-AppModule-5a1db6aad6d9c0c016436eeb18d232e42bc2f7af0fe338d9f06c45489e0e21ba9749a966e5a9e65952877ab9c4839ffbfca376fda41d80c55bb87071cb05594a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-5a1db6aad6d9c0c016436eeb18d232e42bc2f7af0fe338d9f06c45489e0e21ba9749a966e5a9e65952877ab9c4839ffbfca376fda41d80c55bb87071cb05594a"' :
                                            'id="xs-components-links-module-AppModule-5a1db6aad6d9c0c016436eeb18d232e42bc2f7af0fe338d9f06c45489e0e21ba9749a966e5a9e65952877ab9c4839ffbfca376fda41d80c55bb87071cb05594a"' }>
                                            <li class="link">
                                                <a href="components/AboutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AboutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AveragePricesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AveragePricesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContactComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GasStationDetailsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GasStationDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GasStationListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GasStationListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalAlertComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalAlertComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PriceChartsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PriceChartsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SidenavComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SidenavComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#pipes-links-module-AppModule-5a1db6aad6d9c0c016436eeb18d232e42bc2f7af0fe338d9f06c45489e0e21ba9749a966e5a9e65952877ab9c4839ffbfca376fda41d80c55bb87071cb05594a"' : 'data-bs-target="#xs-pipes-links-module-AppModule-5a1db6aad6d9c0c016436eeb18d232e42bc2f7af0fe338d9f06c45489e0e21ba9749a966e5a9e65952877ab9c4839ffbfca376fda41d80c55bb87071cb05594a"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppModule-5a1db6aad6d9c0c016436eeb18d232e42bc2f7af0fe338d9f06c45489e0e21ba9749a966e5a9e65952877ab9c4839ffbfca376fda41d80c55bb87071cb05594a"' :
                                            'id="xs-pipes-links-module-AppModule-5a1db6aad6d9c0c016436eeb18d232e42bc2f7af0fe338d9f06c45489e0e21ba9749a966e5a9e65952877ab9c4839ffbfca376fda41d80c55bb87071cb05594a"' }>
                                            <li class="link">
                                                <a href="pipes/CepMaskPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CepMaskPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ReplaceCommaPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReplaceCommaPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/DownloadEventService.html" data-type="entity-link" >DownloadEventService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GasStationService.html" data-type="entity-link" >GasStationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GithubService.html" data-type="entity-link" >GithubService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Combustivel.html" data-type="entity-link" >Combustivel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CombustivelDetalhado.html" data-type="entity-link" >CombustivelDetalhado</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NavItem.html" data-type="entity-link" >NavItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Posto.html" data-type="entity-link" >Posto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PostoCombustivelDetalhado.html" data-type="entity-link" >PostoCombustivelDetalhado</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PrecoColetado.html" data-type="entity-link" >PrecoColetado</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});