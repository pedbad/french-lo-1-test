import { memo } from 'react';
import { FooterSocialLinks } from './FooterSocialLinks';
import { resolveAsset } from '@/utils/assets';

function FooterComponent() {
  const today = new Date();
  const strYear = today.getFullYear();

  const ucLogoAlt = "University of Cambridge Language Centre logo";
  const ccLogoAlt = "Creative Commons";
  const lcLogoAlt = "Language Centre";
  return (
    <footer>
      {/* Flex Container */}

      <div className="footer-container font-semibold">
        {/* Logo and social links container */}

        <div className={`uclogo`}>
          <a href="https://www.langcen.cam.ac.uk/" target="_blank" rel="noopener noreferrer">
            <img src={resolveAsset('/img/common/footer/ucam-language-centre-horizontal-light.png')} className={`logo theme-light horizontal`} alt={ucLogoAlt}/>
            <img src={resolveAsset('/img/common/footer/ucam-language-centre-vertical-light.png')} className={`logo theme-light vertical`} alt={ucLogoAlt} />
            <img src={resolveAsset('/img/common/footer/ucam-language-centre-horizontal-dark.png')} className={`logo theme-dark horizontal`} alt={ucLogoAlt} />
            <img src={resolveAsset('/img/common/footer/ucam-language-centre-vertical-dark.png')} className={`logo theme-dark vertical`} alt={ucLogoAlt} />
          </a>
          <div className="copyright">
            <small className="copy text-xs block">© {strYear} University of Cambridge</small>
          </div>
        </div>

        {/* Square logos + social icons — grouped as one visual cluster */}
        <div className="logos-social">
          <div className={`square-logos`}>
            <div className="square-logos-row">
              {/* Logo LC */}
              <div className={`lclogo square-logo`}>
                <a href="https://www.langcen.cam.ac.uk/culp/culp-index.html" target="_blank" rel="noopener noreferrer">
                  <img src={resolveAsset('/img/common/footer/lc-logo-black.svg')} className="logo theme-light" alt={lcLogoAlt} />
                  <img src={resolveAsset('/img/common/footer/lc-logo-white.svg')} className="logo theme-dark" alt={lcLogoAlt} />
                </a>
              </div>

              {/* Logo CC */}
              <div className={`cclogo square-logo`}>
                <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener noreferrer">
                  <img src={resolveAsset('/img/common/footer/cc-logo-black.svg')} className="logo theme-light" alt={ccLogoAlt} />
                  <img src={resolveAsset('/img/common/footer/cc-logo-white.svg')} className="logo theme-dark" alt={ccLogoAlt} />
                </a>
              </div>

              {/* Logo elearning */}
              <div className={`elearninglogo square-logo`}>
                <a href="https://www.langcen.cam.ac.uk/opencourseware" target="_blank" rel="noopener noreferrer">
                  <img src={resolveAsset('/img/common/footer/elearning-logo-black.svg')} className="logo theme-light" alt="eLearning" />
                  <img src={resolveAsset('/img/common/footer/elearning-logo-white.svg')} className="logo theme-dark" alt="eLearning" />
                </a>
              </div>
            </div>
          </div>

          <div className={`footer-links`}>
            <FooterSocialLinks />
          </div>
        </div>

        {/* License */}
        <div className={`license`}>
          <p className="license text-footerText text-xs leading-[calc(var(--font-size-xs)*1.6)] font-normal">
							This work is licensed under the Creative Commons
							Attribution-NonCommercial-NoDerivs 4.0 International Licence.<br/>
							To view a copy of this licence, visit: <a className="hover:text-primary font-semibold"
              href="https://creativecommons.org/"
              target="_blank"
              rel="noopener noreferrer"
            >creativecommons.org</a>
            {' · '}Developed by <span className="font-semibold">The Language Centre</span>
          </p>
        </div>
      </div>
      {/* </div> */}
    </footer>
  );
}

export const Footer = memo(FooterComponent);
