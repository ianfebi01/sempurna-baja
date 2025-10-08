<template>
  <div>
    <HeroesMainHeroes />
    <SectionsQuote />
    <SectionsAboutUs />
    <SectionsCatalog />
    <SectionsService />
    <SectionsTestimoni />
    <SectionsContactUs />
  </div>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()
const title = "Ragil Stone | Jasa Pemasangan Batu Alam"
const description = "Ragil Stone melayani pemasangan dinding, taman, kolam, dan lantai batu alam dengan finishing rapi, harga transparan, dan garansi pekerjaan. Berlokasi di Semanu, Gunungkidul, Yogyakarta."
useHead( {
  title : title,
  meta  : [
    // Basic
    {
      name    : "description",
      content : description,
    },
    {
      name    : "keywords",
      content : [
        "jasa pemasangan batu alam gunungkidul",
        "batu alam yogyakarta",
        "jasa tukang batu alam jogja",
        "pemasangan dinding batu alam",
        "lantai batu alam gunungkidul",
        "taman kolam batu alam yogyakarta",
        "batu paras jogja",
        "batu andesit gunungkidul",
        "batu templek yogyakarta",
        "desain custom batu alam",
      ].join( ", " ),
    },

    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: `${config.public.siteUrl}/images/batu-alam/batu-alam-15.webp` },
    { property: "og:url", content: `${config.public.siteUrl}/` },
    { property: "og:type", content: "website" },

    // Twitter
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: `${config.public.siteUrl}/images/batu-alam/batu-alam-15.webp` },
    { name: "twitter:card", content: "summary_large_image" },

    // Robots
    { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
  ],

  link: [
    { rel: "canonical", href: `${config.public.siteUrl}/` },
  ],

  script: [
    {
      type      : "application/ld+json",
      innerHTML : JSON.stringify( {
        "@context" : "https://schema.org",
        "@type"    : "LocalBusiness",
        name       : "Ragil Stone",
        image      : `${config.public.siteUrl}/images/batu-alam/batu-alam-15.webp`,
        "@id"      : config.public.siteUrl,
        url        : config.public.siteUrl,
        telephone  : "+6281999980596",
        email      : "ardynugroho3502@gmail.com",
        address    : {
          "@type"         : "PostalAddress",
          streetAddress   : "Semanu",
          addressLocality : "Gunungkidul",
          addressRegion   : "Yogyakarta",
          addressCountry  : "ID",
        },
        priceRange  : "Rp",
        sameAs      : ["https://wa.me/6281999980596"],
        serviceType : [
          "Pemasangan dinding batu alam",
          "Taman & kolam batu alam",
          "Lantai & jalan setapak",
          "Desain custom batu alam",
        ],
      } ),
    },
  ],
} )


</script>