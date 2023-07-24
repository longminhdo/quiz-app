import { createContext } from 'react';
import { Layout } from '@/types/layout';

export const ClientLayoutContext = createContext<Layout>({
  selectedMenu: {
    key: null,
    label: null,
    icon: null,
  },
  setSelectedMenu: () => undefined,
});
