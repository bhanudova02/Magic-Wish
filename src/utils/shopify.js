export const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
export const storefrontToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

export async function shopifyFetch({ query, variables = {} }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const body = await result.json();

    if (body.errors) {
      console.error("Shopify GraphQL Errors:", body.errors);
      throw new Error(body.errors[0].message);
    }

    return body.data;
  } catch (error) {
    console.error("Error fetching from Shopify:", error);
    throw error;
  }
}

// Queries
export const getProductsQuery = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          tags
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export const getProductQuery = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      tags
      variants(first: 1) {
        edges {
          node {
            id
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
    }
  }
`;

export const customerCreateMutation = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

let cachedBooksPromise = null;

export async function getShopifyBooks() {
    if (cachedBooksPromise) return cachedBooksPromise;

    cachedBooksPromise = (async () => {
        try {
            const data = await shopifyFetch({
                query: getProductsQuery,
                variables: { first: 50 }
            });
            
            return data.products.edges.map(({ node }, index) => {
                const variant = node.variants.edges[0]?.node;
                const priceMatch = variant?.price?.amount || 0;
                const compareAtMatch = variant?.compareAtPrice?.amount || priceMatch;

                let badge = "";
                if (parseFloat(compareAtMatch) > parseFloat(priceMatch)) {
                    const discount = Math.round(((parseFloat(compareAtMatch) - parseFloat(priceMatch)) / parseFloat(compareAtMatch)) * 100);
                    badge = `-${discount}% OFF`;
                }

                const tags = node.tags || [];
                const gender = tags.find(tag => ['boy', 'girl'].includes(tag.toLowerCase()))?.toLowerCase() || 'unisex';
                const age = tags.find(tag => tag.includes('-')) || '2-4';
                
                return {
                    id: node.handle,
                    sortId: index + 1,
                    image: node.images.edges[0]?.node?.url || '',
                    title: node.title,
                    description: node.description,
                    price: `$${priceMatch}`,
                    originalPrice: parseFloat(compareAtMatch) > parseFloat(priceMatch) ? `$${compareAtMatch}` : null,
                    badge,
                    gender,
                    age,
                    tags: tags.map(t => t.toLowerCase())
                };
            });
        } catch (error) {
            console.error("Error fetching books:", error);
            cachedBooksPromise = null;
            return [];
        }
    })();

    return cachedBooksPromise;
}
