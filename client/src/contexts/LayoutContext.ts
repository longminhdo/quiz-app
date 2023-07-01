import { createContext } from 'react';
import { Layout } from '@/types/layout';

export const LayoutContext = createContext<Layout>({
  selectedMenu: {
    key: null,
    label: null,
    icon: null,
  },
  setSelectedMenu: () => undefined,
});
