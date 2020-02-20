const fs = require('fs')
const fetch = require('node-fetch')

const shopifyOptions = {
  apiKey: process.env.SHOPIFY_API_KEY,
  apiPassword: process.env.SHOPIFY_API_PASSWORD,
  storeSubdomain: process.env.SHOPIFY_STORE_SUBDOMAIN
}

const requestFulfilledOrders = async (config, pageInfo, prevOrders) => {
  let ordersArray = (prevOrders) ? prevOrders : []
  let url = ''
  const { apiKey, apiPassword, storeSubdomain } = config
  const today = new Date()
  const minDate = new Date(today.setDate(today.getDate() - 30))

  if (pageInfo) {
    url = ''.concat(
      'https://',
      storeSubdomain,
      '.myshopify.com/admin/api/2019-10/orders.json?',
      'fields=id,name,created_at,fulfillments&limit=250&',
      pageInfo
    )
  } else {
    const queryParameters = {
      fulfillment_status: 'shipped',
      created_at_min: minDate.toISOString(),
      fields: 'id,name,created_at,fulfillments',
      limit: 250
    }
    const queryString = generateQueryString(queryParameters)

    url = ''.concat(
      'https://',
      storeSubdomain,
      '.myshopify.com/admin/api/2019-10/orders.json?',
      queryString
    )
  }

  const requestParams = {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${Buffer.from(apiKey + ':' + apiPassword).toString('base64')}`,
      'Content-Type': 'application/json'
    }
  }

  let nextLink = ''
  const orders = await fetch(url, requestParams)
    .then(res => {
      nextLink = getNextLink(res)
      return res.text()
    })
    .then(text => JSON.parse(text))
    .then(json => json.orders.forEach(order => ordersArray.push(filterOrder(order))))
    .catch(error => {
      console.error({
        message: 'Error on Shopify Request',
        error: error,
        context: {
          url,
          method: requestParams.method
        }
      })
    })

    if (nextLink) {
      ordersArray = await requestFulfilledOrders(config, nextLink, ordersArray)
    }

  return ordersArray
}

const generateQueryString = queryParameters => {
  const queryString = Object.keys(queryParameters).map(key => {
    const encodedKey = encodeURIComponent(key)
    const encodedValue = encodeURIComponent(queryParameters[key])

    return encodedKey + '=' + encodedValue
  }).join('&')

  return queryString
}

const getNextLink = (res) => {
  let nextLink = ''
  const link = res.headers.get('link')

  if (link) {
    nextReference = link.split(",")[link.split(",").length - 1]
    const indexStart = nextReference.search('page_info=')
    const indexEnd = nextReference.search('>')
    const rel =  nextReference.slice(nextReference.search('rel='))

    if (rel === 'rel=\"next\"') {
      nextLink = nextReference.slice(indexStart, indexEnd)
    }
  }

  if (nextLink) {
    return nextLink
  }
}

const saveOrders = async () => {
  const orders = await requestFulfilledOrders(shopifyOptions)
  const jsonOrders = JSON.stringify(orders)

  console.log(`${orders.length} orders received`)

  fs.writeFileSync('./results/fulfilledOrders.json', jsonOrders)
}

const sortOrders = ordersArray => {
  const sorted = ordersArray.sort((past, next) => {
    return new Date(past.created_at) > new Date(next.created_at) ? 1 : -1
  })

  sorted.forEach(order => console.log(order))
}

const filterOrder = order => {
  return {
    orderName: order.name,
    orderId: order.id,
    created_at: order.created_at,
    fulfilled_at: order.fulfillments[0].created_at
  }
}

saveOrders()
