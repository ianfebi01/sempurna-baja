import type { SitemapUrlInput } from "@nuxtjs/sitemap"
import type { ApiSuccess } from "~~/shared/types"
import type { PageListItem } from "~~/shared/types/page"
import type { Product } from "~~/shared/types/product"

export default defineEventHandler( async () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.baseUrl || process.env.NUXT_BASE_URL || "https://content.sempurnabaja.com"

  const urls: SitemapUrlInput[] = [
    {
      loc        : "/",
      changefreq : "daily",
      priority   : 1.0,
    },
    {
      loc        : "/products",
      changefreq : "daily",
      priority   : 0.9,
    },
    {
      loc        : "/privacy-policy",
      changefreq : "monthly",
      priority   : 0.3,
    },
  ]

  // Fetch products for dynamic product routes (/products/:slug)
  try {
    const productsRes = await $fetch<ApiSuccess<{ data: Product[] }>>( `${baseUrl}/api/products?pageSize=1000` )
    const products = productsRes?.data?.data || []

    for ( const product of products ) {
      if ( !product?.slug ) {
        continue
      }

      urls.push( {
        loc        : `/products/${product.slug}`,
        lastmod    : product.updatedAt ? new Date( product.updatedAt ).toISOString() : undefined,
        changefreq : "weekly",
        priority   : 0.8,
        images     : product.image
          ? [
            {
              loc     : product.image,
              title   : product.name,
              caption : product.description ? product.description.slice( 0, 200 ) : undefined,
            },
          ]
          : undefined,
      } )
    }
  } catch ( error ) {
    console.error( "[sitemap] Failed to fetch dynamic products:", error )
  }

  // Fetch published CMS pages for dynamic page routes (/:slug)
  try {
    const pagesRes = await $fetch<ApiSuccess<{ data: PageListItem[] }>>( `${baseUrl}/api/pages?pageSize=1000&published=true&homePage=false` )
    const pages = pagesRes?.data?.data || []

    for ( const page of pages ) {
      if ( !page?.slug || page.isHomePage || page.slug === "home" ) {
        continue
      }

      const bannerImage = page.banner && "image" in page.banner ? page.banner.image : undefined

      urls.push( {
        loc        : `/${page.slug}`,
        lastmod    : page.updatedAt ? new Date( page.updatedAt ).toISOString() : undefined,
        changefreq : "weekly",
        priority   : 0.8,
        images     : bannerImage
          ? [
            {
              loc   : bannerImage,
              title : page.name,
            },
          ]
          : undefined,
      } )
    }
  } catch ( error ) {
    console.error( "[sitemap] Failed to fetch dynamic pages:", error )
  }

  return urls
} )
