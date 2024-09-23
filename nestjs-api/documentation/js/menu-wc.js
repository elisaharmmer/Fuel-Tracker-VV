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
                    <a href="index.html" data-type="index-link">API Fuel Tracker VV</a>
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
                                            'data-bs-target="#controllers-links-module-AppModule-5584364da65887ec7b2692adda22f7fc32b338c7beb1c2b88567333c5c72c184cf09d6140be7bf37e669933db699050ce4788db29d5ffc853744793fff64d499"' : 'data-bs-target="#xs-controllers-links-module-AppModule-5584364da65887ec7b2692adda22f7fc32b338c7beb1c2b88567333c5c72c184cf09d6140be7bf37e669933db699050ce4788db29d5ffc853744793fff64d499"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-5584364da65887ec7b2692adda22f7fc32b338c7beb1c2b88567333c5c72c184cf09d6140be7bf37e669933db699050ce4788db29d5ffc853744793fff64d499"' :
                                            'id="xs-controllers-links-module-AppModule-5584364da65887ec7b2692adda22f7fc32b338c7beb1c2b88567333c5c72c184cf09d6140be7bf37e669933db699050ce4788db29d5ffc853744793fff64d499"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/CombustivelController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CombustivelController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/InsightsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InsightsController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/PostoController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostoController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/PrecoController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrecoController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-5584364da65887ec7b2692adda22f7fc32b338c7beb1c2b88567333c5c72c184cf09d6140be7bf37e669933db699050ce4788db29d5ffc853744793fff64d499"' : 'data-bs-target="#xs-injectables-links-module-AppModule-5584364da65887ec7b2692adda22f7fc32b338c7beb1c2b88567333c5c72c184cf09d6140be7bf37e669933db699050ce4788db29d5ffc853744793fff64d499"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-5584364da65887ec7b2692adda22f7fc32b338c7beb1c2b88567333c5c72c184cf09d6140be7bf37e669933db699050ce4788db29d5ffc853744793fff64d499"' :
                                        'id="xs-injectables-links-module-AppModule-5584364da65887ec7b2692adda22f7fc32b338c7beb1c2b88567333c5c72c184cf09d6140be7bf37e669933db699050ce4788db29d5ffc853744793fff64d499"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CombustivelService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CombustivelService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/InsightsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InsightsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PostoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrecoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrecoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UtilService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UtilService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HealthModule.html" data-type="entity-link" >HealthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-HealthModule-680dce0ee94fc442757f357987020970cd71a9227a276e9f718e1beae2e22affb5b52c9e13feb73b7c37bcc788bd82e9f9acf07742a45bf02df560f712ecaccb"' : 'data-bs-target="#xs-controllers-links-module-HealthModule-680dce0ee94fc442757f357987020970cd71a9227a276e9f718e1beae2e22affb5b52c9e13feb73b7c37bcc788bd82e9f9acf07742a45bf02df560f712ecaccb"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HealthModule-680dce0ee94fc442757f357987020970cd71a9227a276e9f718e1beae2e22affb5b52c9e13feb73b7c37bcc788bd82e9f9acf07742a45bf02df560f712ecaccb"' :
                                            'id="xs-controllers-links-module-HealthModule-680dce0ee94fc442757f357987020970cd71a9227a276e9f718e1beae2e22affb5b52c9e13feb73b7c37bcc788bd82e9f9acf07742a45bf02df560f712ecaccb"' }>
                                            <li class="link">
                                                <a href="controllers/HealthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HealthController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CombustivelController.html" data-type="entity-link" >CombustivelController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/HealthController.html" data-type="entity-link" >HealthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/InsightsController.html" data-type="entity-link" >InsightsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PostoController.html" data-type="entity-link" >PostoController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PrecoController.html" data-type="entity-link" >PrecoController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Combustivel.html" data-type="entity-link" >Combustivel</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Posto.html" data-type="entity-link" >Posto</a>
                                </li>
                                <li class="link">
                                    <a href="entities/PrecoColetado.html" data-type="entity-link" >PrecoColetado</a>
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
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CombustivelService.html" data-type="entity-link" >CombustivelService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InsightsService.html" data-type="entity-link" >InsightsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PostoService.html" data-type="entity-link" >PostoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PrecoService.html" data-type="entity-link" >PrecoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UtilService.html" data-type="entity-link" >UtilService</a>
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
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                        </ul>
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