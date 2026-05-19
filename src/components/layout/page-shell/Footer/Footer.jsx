import { FooterSocialLinks } from './FooterSocialLinks';
import React from 'react';
import { resolveAsset } from '@/utils/assets';

export class Footer extends React.PureComponent{

	render = () => {
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
					</div>

					{/* Square logos */}
					<div className={`square-logos`}>
						<div className="square-logos-row">
							{/* Logo LC */}
							<div className={`lclogo square-logo`}>
								<a href="https://www.langcen.cam.ac.uk/" target="_blank" rel="noopener noreferrer">
									<svg className={`lc-logo logo`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 81" fill="currentColor" role="img" aria-label={lcLogoAlt}>
										<g className="colour-me" clipPath="url(#a)">
											<path
												d="M94.16 35.224a4 4 0 0 1-.462-.508c-3.154-4.24-7.646-7.511-12.523-9.202-1.398-.484-2.646-.758-4.067-1.017-1.984-.36-4.103-.579-6.284-.462-7.935.421-15.831 4.666-20.564 11.42-1.693 2.418-3.102 5.362-3.882 8.138-3.434 12.231 2.126 25.398 13.632 31.304 11.37 5.835 25.35 2.894 33.503-7.352L94.9 65.51l.1-.137s-.139.387-.192.507c-3.258 7.191-10.381 11.917-17.699 14.01-3.545 1.014-7.457 1.336-11.367.925-6.135-.645-11.886-3.037-16.636-7.305-.375-.339-.88-.83-1.294-1.11-.064-.045-.118-.133-.185-.185L38.987 81s-.199-22.727 0-32.135c.523-6.074 2.713-11.804 6.746-16.739 4.333-5.304 10.066-8.787 16.496-10.218 12.024-2.677 25.173 1.953 31.47 12.53.144.242.325.522.462.786" />
											<path
												d="M61.992 54.298a2.983 2.983 0 1 0-.002-5.965 2.983 2.983 0 0 0 .002 5.965M81.777 54.298a2.983 2.983 0 1 0-.001-5.965 2.983 2.983 0 0 0 .001 5.965M71.892 54.297a2.98 2.98 0 1 0 0-5.962 2.98 2.98 0 0 0 0 5.962M1.287-.022h35.017c.71 0 1.287.577 1.287 1.287v78.448c0 .71-.577 1.287-1.287 1.287H1.287C.577 81 0 80.423 0 79.713V1.265C0 .553.577-.022 1.287-.022" />
										</g>
										<defs>
											<clipPath id="a">
												<path className="colour-me" d="M0 0h95v81H0z" />
											</clipPath>
										</defs>
									</svg>
								</a>
							</div>

							{/* Logo CC */}
							<div className={`cclogo square-logo`}>
								<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener noreferrer">
									<svg className={`cc-logo logo`} xmlns="http://www.w3.org/2000/svg" viewBox="5.5 -3.5 64 64" fill="currentColor" role="img" aria-label={ccLogoAlt}>
										<path className="colour-me"
											d="M37.441-3.5q13.428 0 22.857 9.372 4.513 4.514 6.857 10.314 2.343 5.8 2.344 12.314-.001 6.572-2.314 12.313-2.315 5.743-6.828 10.143-4.684 4.628-10.629 7.086-5.942 2.457-12.285 2.457-6.342.001-12.143-2.429-5.8-2.428-10.4-7.027t-7-10.372Q5.5 34.9 5.5 28.5q0-6.343 2.428-12.2t7.057-10.486Q24.127-3.499 37.441-3.5m.116 5.772q-10.971 0-18.458 7.657-3.772 3.829-5.8 8.6a25.2 25.2 0 0 0-2.029 9.972q-.001 5.144 2.029 9.913 2.029 4.774 5.8 8.516t8.515 5.715a25.7 25.7 0 0 0 9.943 1.971q5.14.001 9.973-1.999 4.827-2.001 8.713-5.771 7.485-7.313 7.484-18.344 0-5.314-1.943-10.057-1.941-4.742-5.654-8.458-7.718-7.715-18.573-7.715m-.401 20.915-4.287 2.229q-.686-1.428-1.685-2-1-.57-1.858-.571-4.285 0-4.286 5.657 0 2.57 1.085 4.113 1.086 1.544 3.201 1.544 2.8 0 3.944-2.743l3.942 2q-1.257 2.344-3.486 3.686-2.227 1.343-4.914 1.343-4.286.001-6.915-2.629-2.628-2.628-2.628-7.313 0-4.571 2.657-7.257t6.715-2.686q5.944-.002 8.515 4.627m18.457 0-4.229 2.229q-.686-1.428-1.686-2-1.003-.57-1.914-.571-4.286 0-4.287 5.657 0 2.57 1.086 4.113 1.084 1.544 3.201 1.544 2.799 0 3.941-2.743l4 2q-1.314 2.344-3.541 3.686a9.23 9.23 0 0 1-4.857 1.343q-4.343.001-6.941-2.629-2.603-2.628-2.602-7.313 0-4.571 2.658-7.257 2.655-2.685 6.713-2.686 5.944-.002 8.458 4.627" />
									</svg>
								</a>
							</div>

							{/* Logo elearning */}
							<div className={`elearninglogo square-logo`}>
								<a href="https://www.langcen.cam.ac.uk/opencourseware" target="_blank" rel="noopener noreferrer">
									<img src={resolveAsset('/img/common/footer/eLearning_Logo_Black_NoText_SVG.svg')} className="logo theme-light" alt="eLearning" />
									<img src={resolveAsset('/img/common/footer/eLearning_Logo_White_NoText_SVG.svg')} className="logo theme-dark" alt="eLearning" />
								</a>
							</div>
						</div>
					</div>

					<div className={`footer-links`}>
						<FooterSocialLinks />
					</div>

					{/* Copyright Info */}
					<div className={`copyright`}>
						<small className="copy text-base block">© {strYear} University of Cambridge</small>
						<p className="developed text-xs font-normal">
							Developed by <span className="font-semibold">The Language Centre</span>
						</p>
					</div>

					{/* License */}
					<div className={`license`}>
						<p className="license text-footerText text-base leading-[calc(var(--font-size-base)*1.413)] font-normal">
							This work is licensed under the Creative Commons
							Attribution-NonCommercial-NoDerivs 4.0 International Licence.<br/>
							To view a copy of this licence, visit: <a className="hover:text-primary font-semibold"
								href="https://creativecommons.org/"
								target="_blank"
								rel="noopener noreferrer"
							>creativecommons.org</a>
						</p>
					</div>
				</div>
				{/* </div> */}
			</footer>
		);
	};
}
