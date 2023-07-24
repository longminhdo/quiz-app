import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import React, {
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLeftMenu from '@/components/others/ClientLeftMenu/ClientLeftMenu';
import Logo from '@/components/others/Logo/Logo';
import SearchQuiz from '@/components/others/SearchQuiz/SearchQuiz';
import { routePaths } from '@/constants/routePaths';
import { ClientLayoutContext } from '@/contexts/ClientLayoutContext';
import { MenuItem } from '@/types/layout';
import './QuizLayout.scss';

const { Header, Content, Sider } = Layout;

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
  const navigate = useNavigate();

  const handleJointQuiz = useCallback(() => {
    navigate(routePaths.JOIN);
  }, [navigate]);

  return useMemo(
    () => (
      <ClientLayoutContext.Provider value={{ selectedMenu, setSelectedMenu }}>
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
                style={{ height: 40, gap: 14, transform: 'translateX(-2px)' }}
              />
            </div>
            <ClientLeftMenu />

            <Button className="join-quiz-btn" onClick={handleJointQuiz}>
              <PlusCircleOutlined />
              <span>Join New Quiz</span>
            </Button>
          </Sider>

          <Layout className="site-layout">
            <Header className="header">
              <SearchQuiz />
            </Header>
            <Content className="content-container">
              <div className="content">{children}</div>
            </Content>
          </Layout>
        </Layout>
      </ClientLayoutContext.Provider>
    ),
    [children, collapsed, handleJointQuiz, selectedMenu],
  );
};

export default QuizLayout;
