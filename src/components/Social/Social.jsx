import './Social.scss';
import React from 'react';

export class Social extends React.PureComponent{

	render = () => {





		return (
			<div id={`social`}>
				<h2>Follow us</h2>
				<section className="social-icons-section">
					<ul>
						<li>
							<a href="https://www.facebook.com/uclangcen" aria-label="Facebook">
								{/* Inline SVG so currentColor can be themed via CSS. */}
								<svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" aria-hidden="true" focusable="false">
									<path d="M1024 512C1024 229.23 794.77 0 512 0S0 229.23 0 512c0 255.55 187.23 467.37 432 505.78V660H302V512h130V399.2C432 270.88 508.44 200 625.39 200 681.41 200 740 210 740 210v126h-64.56c-63.6 0-83.44 39.47-83.44 79.96V512h142l-22.7 148H592v357.78c244.77-38.41 432-250.23 432-505.78" />
									<path d="M711.3 660 734 512H592v-96.04c0-40.49 19.84-79.96 83.44-79.96H740V210s-58.59-10-114.61-10C508.44 200 432 270.88 432 399.2V512H302v148h130v357.78c26.07 4.09 52.78 6.22 80 6.22s53.93-2.13 80-6.22V660z" />
								</svg>
							</a>
						</li>
						<li>
							<a href="https://www.linkedin.com/company/94076110" aria-label="LinkedIn">
								{/* Inline SVG so currentColor can be themed via CSS. */}
								<svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 144" aria-hidden="true" focusable="false">
									<path d="M133.34 0H10.63C4.76 0 0 4.65 0 10.38v123.23C0 139.35 4.76 144 10.63 144h122.72c5.87 0 10.66-4.65 10.66-10.39V10.38C144 4.65 139.22 0 133.34 0M42.71 122.71H21.35V53.99h21.36zM32.04 44.59c-6.85 0-12.39-5.55-12.39-12.39 0-6.83 5.54-12.38 12.39-12.38 6.83 0 12.38 5.55 12.38 12.38-.01 6.84-5.56 12.39-12.38 12.39m90.67 78.12h-21.34V89.29c0-7.97-.15-18.22-11.1-18.22-11.11 0-12.82 8.68-12.82 17.64v34H56.11V53.99H76.6v9.39h.29c2.85-5.4 9.82-11.1 20.21-11.1 21.63 0 25.62 14.23 25.62 32.74v37.69z" />
								</svg>
							</a>
						</li>
						<li>
							<a href="https://x.com/uclangcen" aria-label="X">
								{/* Inline SVG so currentColor can be themed via CSS. */}
								<svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227" aria-hidden="true" focusable="false">
									<path d="M714.2 519.3 1160.9 0H1055L667.1 450.9 357.3 0H0l468.5 681.8L0 1226.4h105.9l409.6-476.2 327.2 476.2H1200zm-145 168.5-47.5-67.9L144 79.7h162.6l304.8 436 47.5 67.9 396.2 566.7H892.5z" />
								</svg>
							</a>
						</li>
					</ul>
				</section>
			</div>
		);
	};
}
