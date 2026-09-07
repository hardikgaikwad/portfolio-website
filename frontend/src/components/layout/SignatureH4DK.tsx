/* ═══════════════════════════════════════════════════════════
   SignatureH4DK.tsx — Authentic Hand-Sprayed "H4DK" Signature Tag
   Faithfully recreates the exact hand-sprayed reference image
   Positioned at the bottom-right of the page above the footer
   ═══════════════════════════════════════════════════════════ */

import './SignatureH4DK.css';

export default function SignatureH4DK() {
  return (
    <aside className="signature-h4dk-container" aria-label="Personal Signature">
      <div className="signature-h4dk" title="H4DK Signature Tag">
        <picture>
          <source srcSet="/images/h4dk_signature.webp" type="image/webp" />
          <img
            src="/images/h4dk_signature.png"
            alt="H4DK Hand-Sprayed Cybersecurity Graffiti Signature"
            className="signature-h4dk__img"
            width={989}
            height={590}
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
    </aside>
  );
}
