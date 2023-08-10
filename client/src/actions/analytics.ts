import { AnalyticsAction } from 'src/constants/action';
import { GET } from '@/utilities/request';

export const countAll = () => ({
  type: AnalyticsAction.COUNT,
  promise: GET('/analytics/count'),
});
