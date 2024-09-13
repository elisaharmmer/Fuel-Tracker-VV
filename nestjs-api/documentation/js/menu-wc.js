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
                    <a href="index.html" data-type="index-link">nestjs-api documentation</a>
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
                                            'data-bs-target="#controllers-links-module-AppModule-8164b7db4b791c54b4b97818908e61940c5007de0e35b64f51fe839b3f815e8fd09066fefaeba282835e3110f66854d250f717693835710a578dac94723fa182"' : 'data-bs-target="#xs-controllers-links-module-AppModule-8164b7db4b791c54b4b97818908e61940c5007de0e35b64f51fe839b3f815e8fd09066fefaeba282835e3110f66854d250f717693835710a578dac94723fa182"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-8164b7db4b791c54b4b97818908e61940c5007de0e35b64f51fe839b3f815e8fd09066fefaeba282835e3110f66854d250f717693835710a578dac94723fa182"' :
                                            'id="xs-controllers-links-module-AppModule-8164b7db4b791c54b4b97818908e61940c5007de0e35b64f51fe839b3f815e8fd09066fefaeba282835e3110f66854d250f717693835710a578dac94723fa182"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/CombustivelController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CombustivelController</a>
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
                                        'data-bs-target="#injectables-links-module-AppModule-8164b7db4b791c54b4b97818908e61940c5007de0e35b64f51fe839b3f815e8fd09066fefaeba282835e3110f66854d250f717693835710a578dac94723fa182"' : 'data-bs-target="#xs-injectables-links-module-AppModule-8164b7db4b791c54b4b97818908e61940c5007de0e35b64f51fe839b3f815e8fd09066fefaeba282835e3110f66854d250f717693835710a578dac94723fa182"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-8164b7db4b791c54b4b97818908e61940c5007de0e35b64f51fe839b3f815e8fd09066fefaeba282835e3110f66854d250f717693835710a578dac94723fa182"' :
                                        'id="xs-injectables-links-module-AppModule-8164b7db4b791c54b4b97818908e61940c5007de0e35b64f51fe839b3f815e8fd09066fefaeba282835e3110f66854d250f717693835710a578dac94723fa182"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CombustivelService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CombustivelService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PostoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrecoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrecoService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HealthModule.html" data-type="entity-link" >HealthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-HealthModule-a6058a8d468e06662bb0c8da84ba7d5cf68369c49fb12b89cc73376d9bf247b69fcb6d634afc79080e2665c6b04c17913592380127f6b07e99c14bfe595c0efc"' : 'data-bs-target="#xs-controllers-links-module-HealthModule-a6058a8d468e06662bb0c8da84ba7d5cf68369c49fb12b89cc73376d9bf247b69fcb6d634afc79080e2665c6b04c17913592380127f6b07e99c14bfe595c0efc"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HealthModule-a6058a8d468e06662bb0c8da84ba7d5cf68369c49fb12b89cc73376d9bf247b69fcb6d634afc79080e2665c6b04c17913592380127f6b07e99c14bfe595c0efc"' :
                                            'id="xs-controllers-links-module-HealthModule-a6058a8d468e06662bb0c8da84ba7d5cf68369c49fb12b89cc73376d9bf247b69fcb6d634afc79080e2665c6b04c17913592380127f6b07e99c14bfe595c0efc"' }>
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
                                    <a href="injectables/PostoService.html" data-type="entity-link" >PostoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PrecoService.html" data-type="entity-link" >PrecoService</a>
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