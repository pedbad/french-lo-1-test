import { Facebook, Instagram, Linkedin, X, Youtube } from "lucide-react";
import { createElement } from "react";

const FOOTER_LINKS = [
	{
		href: "https://www.facebook.com/uclangcen/",
		icon: Facebook,
		label: "Facebook",
		variant: "facebook",
	},
	{
		href: "https://x.com/uclangcen",
		icon: X,
		label: "X (Twitter)",
		variant: "x",
	},
	{
		href: "https://www.youtube.com/cambridgeuniversity",
		icon: Youtube,
		label: "YouTube",
		variant: "youtube",
	},
	{
		href: "https://www.linkedin.com/company/university-of-cambridge-language-centre/posts/?feedView=all",
		icon: Linkedin,
		label: "LinkedIn",
		variant: "linkedin",
	},
	{
		href: "https://www.instagram.com/cambridgeuniversity/",
		icon: Instagram,
		label: "Instagram",
		variant: "instagram",
	},
];

export function FooterSocialLinks() {
	return (
		<div className="footer-links-block" role="group" aria-label="Follow us">
			<div className="footer-link-icons">
				{FOOTER_LINKS.map(({ href, icon, label, variant }) => (
					<a
						key={label}
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={label}
						className={`footer-link-button footer-link-button--${variant}`}
						data-variant={variant}
						title={label}
					>
						{createElement(icon, {
							"aria-hidden": "true",
							className: "footer-link-glyph",
							strokeWidth: 1.9,
						})}
						<span className="sr-only">{label}</span>
					</a>
				))}
			</div>
		</div>
	);
}
