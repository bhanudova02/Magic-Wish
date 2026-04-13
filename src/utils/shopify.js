export const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
export const storefrontToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
export const shopId = import.meta.env.VITE_SHOPIFY_SHOP_ID;

export async function customerAccountFetch({ query, variables = {} }) {
  const endpoint = `https://shopify.com/${shopId}/account/api/2024-07/graphql`;
  const token = localStorage.getItem('shopify_access_token');

  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token.startsWith('Bearer ') ? token : `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const body = await result.json();

    if (body.errors) {
      console.error("Shopify Customer Account API Errors:", body.errors);
      throw new Error(body.errors[0].message);
    }

    return body.data;
  } catch (error) {
    console.error("Error fetching from Customer Account API:", error);
    throw error;
  }
}

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

export const getCustomerProfileQuery = `
  query getCustomerProfile {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      phoneNumber {
        phoneNumber
      }
      defaultAddress {
        id
        address1
        address2
        city
        province
        zip
        country
      }
      addresses(first: 10) {
        edges {
          node {
            id
            address1
            address2
            city
            province
            zip
            country
          }
        }
      }
    }
  }
`;

export const getCustomerOrdersQuery = `
  query getCustomerOrders($first: Int!) {
    customer {
      orders(first: $first) {
        edges {
          node {
            id
            name
            processedAt
            totalPrice {
              amount
              currencyCode
            }
            financialStatus
            fulfillmentStatus
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                  image {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const customerAddressCreateMutation = `
  mutation customerAddressCreate($address: CustomerAddressInput!) {
    customerAddressCreate(address: $address) {
      customerAddress {
        id
      }
      userErrors {
        field
        message
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

export const cartCreateMutation = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
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
                    variantId: variant?.id,
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
