import { SOCIAL_LINKS } from "../socialLinks";
import { resolveAsset } from "@/utils/assets";

export function FooterSocialLinks() {
  return (
    <div className="footer-links-block" role="group" aria-label="Follow us">
      <div className="footer-link-icons">
        {SOCIAL_LINKS.map(({ href, img, label, variant }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`footer-link-button footer-link-button--${variant}`}
            data-variant={variant}
          >
            <img
              src={resolveAsset(img)}
              alt=""
              aria-hidden="true"
              className="footer-link-icon"
            />
            <span className="sr-only">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
