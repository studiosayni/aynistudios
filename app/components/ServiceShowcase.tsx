import Image from "next/image";
import Link from "next/link";
import { services, serviceArt } from "../lib/publicContent";

type Service = (typeof services)[number];

// A service as a still with the title over it. The still is a frame from a
// film we made for that kind of client, so the card shows the work rather
// than describing it. Used on the homepage, the services index, and the
// Los Angeles page.
export function ServiceCard({
  service,
  priority = false,
}: {
  service: Service;
  priority?: boolean;
}) {
  const art = serviceArt[service.slug];
  return (
    <Link
      href={`/services/${service.slug}`}
      className="service-card"
      data-track="service_view"
    >
      <div className="service-card-art" aria-hidden="true">
        {art && (
          <Image
            src={art.image}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="service-card-body">
        <span className="service-card-number">{service.number}</span>
        <h3>{service.title}</h3>
        <p>{service.short}</p>
        <span className="service-card-cta">
          Explore this service <span aria-hidden="true">↗</span>
        </span>
      </div>
    </Link>
  );
}

export default function ServiceShowcase({
  items = services,
  headingLevel = "h3",
}: {
  items?: readonly Service[];
  headingLevel?: "h2" | "h3";
}) {
  return (
    <div className={`service-card-grid service-card-grid-${headingLevel}`}>
      {items.map((service, index) => (
        <ServiceCard key={service.slug} service={service} priority={index < 3} />
      ))}
    </div>
  );
}
