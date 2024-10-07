export const config = {
  current: 'ALG',
  providers: [
    {
      provider_code: 'ALG',
      searched_items: 'hits',
      filters: 'facets',
      searched_term: 'query',
      total_pages: 'nbPages',
      current_page: 'page',
      numerical_filter_stats: 'facets_stats',
      total_hits: 'nbHits',
      __typename: 'SearchMappingProviders',
    },
    {
      provider_code: 'KLV',
      searched_items: 'records',
      filters: 'filters',
      searched_term: 'meta.searchedTerm',
      total_pages: '(totalResultsFound//noOfResults)+1',
      current_page: 'offset/20',
      numerical_filter_stats: null,
      total_hits: 'meta.totalResultsFound',
      __typename: 'SearchMappingProviders',
    },
  ],
  apiConfig: {
    ALG: {
      url: 'https://api-apollo.dentalkart.com/search/results',
      key: 'ZRLluE5Jm8HeCW0Inb7f1JiXzvN6mt1nLVOGnzWn',
    },
    KLV: {
      url: 'https://ksejf1oco7.execute-api.ap-south-1.amazonaws.com/prod/V1/search/results',
      key: '7wnqtZWKCtiqRVG4eVgZsY9L8mTowHz7fliFsAYS',
    },
  },
  __typename: 'SearchMapping',
};
