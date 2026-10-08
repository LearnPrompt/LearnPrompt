export function createOrganizationSchema(homeUrl: URL, logoUrl: URL) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${homeUrl.href}#organization`,
    name: "LearnPrompt",
    url: homeUrl.href,
    logo: logoUrl.href,
    sameAs: ["https://github.com/LearnPrompt/LearnPrompt"],
  };
}
