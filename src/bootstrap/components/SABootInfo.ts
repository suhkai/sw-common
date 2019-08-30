'use strict';

import Base from './Base';
import SALogo from './SALogo';
import SALabel from './SALabel';
import SAProgress from './SAInvertedProgress';

export default class LogoContainer extends Base<HTMLDivElement> {
    private svgLogo: SALogo;
    private logoLabel: SALabel;
    private svgLogoContainer: Base<HTMLDivElement>;
    private progress1: SAProgress;
   // private progress2: SAProgress;
   // private progress3: SAProgress;
   // private progress4: SAProgress;


    constructor({ dataAttr = 'bootstrap-inner' }) {
        super({ dataAttr });
        this.svgLogo = new SALogo({});
        this.logoLabel = new SALabel({});
        this.svgLogoContainer = new Base<HTMLDivElement>({ dataAttr: 'logo-container' });
        this.progress1 = new SAProgress({ className: 'progress-1' });
     //   this.progress2 = new SAProgress({ className: 'progress-2' });
     //   this.progress3 = new SAProgress({ className: 'progress-3' });
     //   this.progress4 = new SAProgress({ className: 'progress-4' });
    }

    createFragment() {
        super.createFragment();

        //"Super-Algos"
        this.logoLabel.createFragment(); 
        this.progress1.createFragment();
       // this.progress2.createFragment();
       // this.progress3.createFragment();
       // this.progress4.createFragment();
        //
        this.svgLogoContainer.createFragment();
        this.svgLogo.createFragment(); //svg

        //wrap progess into a container
        const progressContainer = new Base<HTMLDivElement>({ dataAttr: 'progress-container' });
        progressContainer.createFragment();

        this.svgLogoContainer.append(progressContainer);
        progressContainer.append(this.progress1);
        //progressContainer.append(this.progress2);
        //progressContainer.append(this.progress3);
        //progressContainer.append(this.progress4);
   
        this.svgLogoContainer.append(this.logoLabel);
        this.svgLogoContainer.append(this.svgLogo);

        //finally
        this.append(this.svgLogoContainer);
    }

    // make it more fancy
    render() {
        this.svgLogo.render();
    }
}



