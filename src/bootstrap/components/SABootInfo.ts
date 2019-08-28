'use strict';

import Base from './Base';
import SALogo from './SALogo';
import SALabel from './SALabel';

export default class LogoContainer extends Base<HTMLDivElement> {
    private svgLogo: SALogo;
    private statusLabel: SALabel;
    private svgLogoContainer: Base<HTMLDivElement>;
    
    constructor({ dataAttr = 'bootstrap-inner' }) {
        super({ dataAttr });
        this.svgLogo = new SALogo({});
        this.statusLabel = new SALabel({});
        this.svgLogoContainer = new Base<HTMLDivElement>({ dataAttr: 'logo-container'});
    }

    createFragment(){
        super.createFragment();
        this.svgLogo.createFragment();
        this.statusLabel.createFragment();
        this.svgLogoContainer.createFragment();
        this.append(this.svgLogoContainer);
        this.svgLogoContainer.append(this.statusLabel);
        this.svgLogoContainer.append(this.svgLogo);
    }

    // make it more fancy
    render(){
        this.svgLogo.render();
    }
}



