import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import InvoicePDF from "../pdf/InvoicePDF";
import type { Client, Invoice, Project } from "./types";

// Server-only. Returns a Buffer of the rendered invoice PDF.
export async function generateInvoicePDF(args: {
  invoice: Invoice;
  project: Project;
  client: Client;
}): Promise<Buffer> {
  const element = createElement(InvoicePDF, args);
  // renderToBuffer expects ReactElement<DocumentProps> but our wrapper returns
  // a <Document> at runtime — cast to satisfy the strict type signature.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return renderToBuffer(element as any) as unknown as Promise<Buffer>;
}
