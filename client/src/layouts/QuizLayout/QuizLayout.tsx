import { Layout } from 'antd';
import React, {
  ReactElement,
  useMemo,
  useState,
} from 'react';
import Logo from '@/components/others/Logo/Logo';
import { LayoutContext } from '@/contexts/LayoutContext';
import { MenuItem } from '@/types/layout';
import './QuizLayout.scss';

const { Header, Content, Sider, Footer } = Layout;

interface QuizLayoutProps {
  children: ReactElement;
}

const QuizLayout: React.FC<QuizLayoutProps> = ({ children }) => {
  const [selectedMenu, setSelectedMenu] = useState<MenuItem>({
    key: null,
    icon: null,
    label: null,
  });
  const [collapsed, setCollapsed] = useState<boolean>(
    () => !(window.innerWidth > 960),
  );

  return useMemo(
    () => (
      <LayoutContext.Provider value={{ selectedMenu, setSelectedMenu }}>
        <Layout hasSider className="quiz-layout">
          <Sider
            width={260}
            className="sider"
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              setCollapsed(broken);
            }}
            collapsed={collapsed}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 80,
              }}
            >
              <Logo
                style={{ height: 60, gap: 14, transform: 'translateX(-2px)' }}
                fullLogo
              />
            </div>
          </Sider>

          <Layout className="site-layout">
            <Header className="header" />
            <Content className="content-container">
              <div className="content">{children}</div>
            </Content>
            <Footer className="footer" style={{ textAlign: 'center' }}>
              HUST Quiz ©2023 Hanoi University of Science and Technology
            </Footer>
          </Layout>
        </Layout>
      </LayoutContext.Provider>
    ),
    [children, collapsed, selectedMenu],
  );
};

export default QuizLayout;
