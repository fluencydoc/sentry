export type DiscoverEventParameters = {
  'discover_views.add_to_dashboard.modal_open': {saved_query: boolean};
  'discover_views.add_to_dashboard.confirm': {};
};

export type DiscoverEventKey = keyof DiscoverEventParameters;

export const discoverEventMap: Record<DiscoverEventKey, string | null> = {
  'discover_views.add_to_dashboard.modal_open':
    'Discover2: Add to Dashboard modal opened',
  'discover_views.add_to_dashboard.confirm':
    'Discover2: Add to Dashboard modal form submitted',
};
