import { Spin, message } from 'antd';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import QuizManagementLayout from '@/layouts/QuizManagementLayout/QuizManagementLayout';
import { setWindowWidth } from '@/modules/redux/slices/appReducer';
import RouteWrapper from '@/modules/routes/RouteWrapper';

import AccessDeniedPage from '@/pages/AccessDeniedPage/AccessDeniedPage';
import CollectionDetailPage from '@/pages/CollectionDetailPage/CollectionDetailPage';
import CollectionListPage from '@/pages/CollectionListPage/CollectionListPage';
import JoinPage from '@/pages/JoinPage/JoinPage';
import LoginCallback from '@/pages/LoginPage/LoginCallback';
import LoginPage from '@/pages/LoginPage/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import QuizDetailPage from '@/pages/QuizDetailPage/QuizDetailPage';
import QuizListPage from '@/pages/QuizListPage/QuizListPage';
import QuizPage from '@/pages/QuizPage/QuizPage';
import ReportsPage from '@/pages/ReportsPage/ReportsPage';
import HustRedirect from './pages/LoginPage/HustRedirect';

import AdminRoute from '@/components/HOCs/AdminRoute';
import ProtectedRoute from './components/common/ProtectedRoute';
import UnprotectedRoute from './components/common/UnprotectedRoute';
import { routePaths } from './constants/routePaths';


import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from './hooks/useTypedSelector';

const MessageWrapper = ({ children }) => {
  const [, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

const App: React.FC = () => {
  const { loading } = useTypedSelector((state: any) => state.app);
  const [run] = useDispatchAsyncAction();

  useEffect(() => {
    const handleResize = () => {
      run(setWindowWidth(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [run]);

  return (
    <MessageWrapper>
      <BrowserRouter>
        <RouteWrapper>
          <Spin spinning={loading}>
            <Routes>
              <Route
                path={routePaths.COLLECTIONS}
                element={(
                  <ProtectedRoute>
                    <AdminRoute>
                      <QuizManagementLayout>
                        <CollectionListPage />
                      </QuizManagementLayout>
                    </AdminRoute>
                  </ProtectedRoute>
                )}
              />
              <Route
                path={routePaths.COLLECTION_DETAIL}
                element={(
                  <ProtectedRoute>
                    <AdminRoute>
                      <QuizManagementLayout>
                        <CollectionDetailPage />
                      </QuizManagementLayout>
                    </AdminRoute>
                  </ProtectedRoute>
                )}
              />
              <Route
                path={routePaths.REPORTS}
                element={(
                  <ProtectedRoute>
                    <AdminRoute>
                      <QuizManagementLayout>
                        <ReportsPage />
                      </QuizManagementLayout>
                    </AdminRoute>
                  </ProtectedRoute>
                )}
              />
              <Route
                path={routePaths.QUIZZES}
                element={(
                  <ProtectedRoute>
                    <AdminRoute>
                      <QuizManagementLayout>
                        <QuizListPage />
                      </QuizManagementLayout>
                    </AdminRoute>
                  </ProtectedRoute>
                )}
              />
              <Route
                path={routePaths.QUIZ_DETAIL}
                element={(
                  <ProtectedRoute>
                    <AdminRoute>
                      <QuizManagementLayout>
                        <QuizDetailPage />
                      </QuizManagementLayout>
                    </AdminRoute>
                  </ProtectedRoute>
                )}
              />

              <Route
                path={routePaths.JOIN}
                element={(
                  <ProtectedRoute>
                    <JoinPage />
                  </ProtectedRoute>
                )}
              />
              <Route
                path={routePaths.QUIZ}
                element={(
                  <ProtectedRoute>
                    <QuizPage />
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
                path={routePaths.ACCESS_DENIED}
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
