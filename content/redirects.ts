/**
 * Permanent redirects from the previous codec-info.hr site, so existing links
 * and search rankings carry over. Retired products (POS, Crypto modul) point to
 * the services overview.
 */
export const legacyRedirects: { source: string; destination: string }[] = [
  { source: "/index.html", destination: "/hr" },
  { source: "/onama.html", destination: "/hr/o-nama" },
  { source: "/cam.html", destination: "/hr/usluge/obracun-telefonskih-troskova" },
  { source: "/pos.html", destination: "/hr/usluge" },
  { source: "/crypto_modul.html", destination: "/hr/usluge" },
  { source: "/podrska.html", destination: "/hr/podrska" },
  { source: "/hr/usluge/podrska-i-odrzavanje", destination: "/hr/podrska" },
  { source: "/en/services/support-and-maintenance", destination: "/en/support" },
  { source: "/reference.html", destination: "/hr/reference" },
  { source: "/kontakt.html", destination: "/hr/kontakt" },
  { source: "/password.html", destination: "/hr/kontakt" },
];
