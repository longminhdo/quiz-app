export interface MenuItem {
  key: string | null;
  label: string | null;
  icon: React.ComponentType | null;
}

export interface Layout {
  selectedMenu: MenuItem;
  setSelectedMenu: any;
}
