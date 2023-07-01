import React from 'react';
import { Spin, message } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RouteWrapper from '@/modules/routes/RouteWrapper';
import useTypedSelector from './hooks/useTypedSelector';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import { routePaths } from './constants/routePaths';

import LoginPage from '@/pages/LoginPage/LoginPage';
import LoginCallback from '@/pages/LoginPage/LoginCallback';
import AccessDeniedPage from '@/pages/AccessDeniedPage/AccessDeniedPage';

import ProtectedRoute from './components/common/ProtectedRoute';
import UnprotectedRoute from './components/common/UnprotectedRoute';
import HustRedirect from './pages/LoginPage/HustRedirect';
import QuizManagementLayout from '@/layouts/QuizManagementLayout/QuizManagementLayout';
import LibraryPage from '@/pages/LibraryPage/LibraryPage';
import ReportsPage from '@/pages/ReportsPage/ReportsPage';
import MyQuizzesPage from '@/pages/MyQuizzesPage/MyQuizzesPage';

const MessageWrapper = ({ children }) => {
  const [, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

const App = () => {
  const { loading } = useTypedSelector((state: any) => state.app);

  return (
    <MessageWrapper>
      <BrowserRouter>
        <RouteWrapper>
          <Spin spinning={loading}>
            <Routes>
              <Route
                path={routePaths.LIBRARY}
                element={(
                  <ProtectedRoute>
                    <QuizManagementLayout>
                      <LibraryPage />
                    </QuizManagementLayout>
                  </ProtectedRoute>
              )}
              />
              <Route
                path={routePaths.REPORTS}
                element={(
                  <ProtectedRoute>
                    <QuizManagementLayout>
                      <ReportsPage />
                    </QuizManagementLayout>
                  </ProtectedRoute>
              )}
              />
              <Route
                path={routePaths.MY_QUIZZES}
                element={(
                  <ProtectedRoute>
                    <QuizManagementLayout>
                      <MyQuizzesPage />
                    </QuizManagementLayout>
                  </ProtectedRoute>
              )}
              />
              <Route
                path={routePaths.LOGIN}
                element={(
                  <UnprotectedRoute>
                    <LoginPage />
                  </UnprotectedRoute>
              )}
              />
              <Route
                path={routePaths.LOGIN_CALLBACK}
                element={(
                  <UnprotectedRoute>
                    <LoginCallback />
                  </UnprotectedRoute>
              )}
              />
              <Route
                path={routePaths.HUST_REDIRECT}
                element={(
                  <UnprotectedRoute>
                    <HustRedirect />
                  </UnprotectedRoute>
              )}
              />
              <Route
                path={routePaths.FORM_ACCESS_DENIED}
                element={(
                  <AccessDeniedPage />
              )}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Spin>
        </RouteWrapper>
      </BrowserRouter>
    </MessageWrapper>
  );
};

export default App;
