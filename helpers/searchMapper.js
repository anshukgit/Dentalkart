export const searchMapper = (searchConfig = {}, result = {}) => {
  const config = searchConfig?.providers?.find(
    prov => prov.provider_code === searchConfig.current,
  );

  let data = result?.hits ?? {},
    _filters = result?.default_facets ?? {};

  const format_page_info = {
    ALG: {
      total_pages: data?.[config['total_pages']] ?? null,
      current_page: data?.[config['current_page']] ?? null,
      searched_term: data?.[config['searched_term']] ?? '',
      total_hits: data?.[config['total_hits']] ?? null,
    },
    KLV: {
      total_pages: data?.meta?.totalResultsFound
        ? parseInt(data.meta.totalResultsFound / data.meta.noOfResults + 1)
        : null,
      current_page: data?.meta?.offset ? parseInt(data.meta.offset / 20) : null,
      searched_term: data?.meta?.searchedTerm ?? '',
      total_hits: data?.meta?.totalResultsFound ?? null,
    },
  };

  return {
    searchdata: {
      ...format_page_info[config?.provider_code],
      searched_items: getSearchItem(config, data?.[config['searched_items']]),
      filters: getFilters(config, _filters),
    },
  };
};

const formatImageUrl = url => {
  if (url.includes('www')) url = url.replace('www', 'images');
  if (url.includes('staging')) url = url.replace('staging', 'images');
  if (url.includes('needtochange')) url = url.replace('needtochange/', '');
  return url;
};

const formatUrl = url => {
  if (url.includes('https://www.dentalkart.com/'))
    url = url.replace('https://www.dentalkart.com/', '');
  if (url.includes('https://staging.dentalkart.com/'))
    url = url.replace('https://staging.dentalkart.com/', '');
  return url;
};

const getProductUrl = product => {
  let url = '#';
  if (product.url_key) {
    url = `/${product.url_key}.html`;
  } else if (product.url) {
    const indexedPrefix = 'https://www.dentalkart.com';
    url = product.url.replace(indexedPrefix, '');
  }

  return url;
};

const itemObj = {
  ALG: (item, config) => ({
    sku: item?.sku ?? null,
    object_id: item?.objectID ?? null,
    name: item?.name ?? '',
    thumbnail_url: item?.thumbnail_url,
    image_url: item?.image_url,
    in_stock: item.in_stock === 1 ? true : false,
    demo_available: item?.demo_available ?? null,
    manufacturer: item?.manufacturer ?? null,
    prices: getPrice(item, config),
    rating_count: item?.rating_count ?? null,
    msrp: item?.msrp ?? null,
    rating: item?.rating_summary ? (item.rating_summary / 20).toFixed(2) : null,
    short_description: item?.short_description ?? null,
    type_id: item?.type_id ?? null,
    url_key: getProductUrl(item),
    tag: item.tag ?? null,
    _queryID: item?._queryID ?? null,
    _position: item?._position ?? null,
  }),
  KLV: (item, config) => ({
    sku: item?.sku ?? null,
    object_id: item?.id ?? null,
    name: item?.name ?? '',
    image_url: formatImageUrl(item?.imageUrl),
    in_stock: item?.inStock === 'yes' ? true : false,
    demo_available: item?.demo_available ?? null,
    manufacturer: item?.manufacturer ?? null,
    prices: getPrice(item, config),
    rating_count: item?.rating_count ?? null,
    rating: item?.rating ?? null,
    short_description: item?.shortDesc ?? null,
    type_id: item?.type_id ?? null,
    url_key: formatUrl(item?.url),
    tag: item.tag ?? null,
  }),
};

const getSearchItem = (config = {}, items = []) => {
  if (items.length === 0) return [];
  return items.map(item => itemObj?.[config.provider_code]?.(item, config));
};

const getPrice = (item, config) => {
  let minValue, regularValue, currency;
  if (config.provider_code === 'ALG') {
    minValue = item?.prices?.minimalPrice?.amount?.value;
    regularValue = item?.prices?.regularPrice?.amount?.value;
    currency = item?.prices?.minimalPrice?.amount?.currency;
  }
  if (config.provider_code === 'KLV') {
    minValue = item?.salePrice;
    regularValue = item?.price;
    currency = item?.currency;
  }
  return {
    minimalPrice: {
      amount: {
        value: minValue,
        currency: currency,
      },
    },
    regularPrice: {
      amount: {
        value: regularValue,
        currency: currency,
      },
    },
  };
};

const getFilters = (config = {}, data = {}) => {
  if (config.provider_code === 'ALG') {
    if (Object.keys(data).length === 0) return [];
    return [
      {
        key: 'manufacturer',
        value: [...Object.keys(data?.['manufacturer'] ?? {})],
      },
      {
        key: 'categories',
        value: [...Object.keys(data?.['categories.level0'] ?? {})],
      },
      {
        key: 'rating_summary',
        value: [...Object.keys(data?.['rating_summary'] ?? {})],
      },
    ];
  }
  if (config.provider_code === 'KLV') {
    let _filters = [];
    if (data.length === 0) return [];
    data?.map(item => {
      if (item.key === 'category') {
        _filters.push({
          key: 'categories',
          value: item?.options?.map(val => val.value),
        });
      }
      if (item.key === 'manufacturer') {
        _filters.push({
          key: 'manufacturer',
          value: item?.options?.map(val => val.value),
        });
      }

      return null;
    });
    return _filters;
  }
  return [];
};
