import { STUDIO_ADDRESS } from "../lib/publicContent";

export default function BusinessAddress() {
  return (
    <address className="not-italic leading-relaxed">
      {STUDIO_ADDRESS.streetAddress}<br />
      {STUDIO_ADDRESS.addressLocality}, {STUDIO_ADDRESS.addressRegion} {STUDIO_ADDRESS.postalCode}
    </address>
  );
}
