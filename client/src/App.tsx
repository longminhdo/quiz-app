import { Spin, message } from 'antd';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import QuizManagementLayout from '@/layouts/QuizManagementLayout/QuizManagementLayout';
import { setBreakpoint, setWindowWidth } from '@/modules/redux/slices/appReducer';
import RouteWrapper from '@/modules/routes/RouteWrapper';

import AccessDeniedPage from '@/pages/AccessDeniedPage/AccessDeniedPage';
import CollectionDetailPage from '@/pages/CollectionDetailPage/CollectionDetailPage';
import CollectionListPage from '@/pages/CollectionListPage/CollectionListPage';
import HomePage from '@/pages/HomePage/HomePage';
import JoinPage from '@/pages/JoinPage/JoinPage';
import HustRedirect from '@/pages/LoginPage/HustRedirect';
import LoginCallback from '@/pages/LoginPage/LoginCallback';
import LoginPage from '@/pages/LoginPage/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import ProfilePage from '@/pages/ProfilePage/ProfilePage';
import QuizDetailPage from '@/pages/QuizDetailPage/QuizDetailPage';
import QuizListPage from '@/pages/QuizListPage/QuizListPage';
import QuizPage from '@/pages/QuizPage/QuizPage';
import ReportsPage from '@/pages/ReportsPage/ReportsPage';

import AdminRoute from '@/components/HOCs/AdminRoute';
import UserWrapper from '@/components/HOCs/UserWrapper';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import UnprotectedRoute from '@/components/common/UnprotectedRoute';
import { routePaths } from '@/constants/routePaths';

import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import QuizLayout from '@/layouts/QuizLayout/QuizLayout';
import useTypedSelector from './hooks/useTypedSelector';
import SettingsPage from '@/pages/SettingsPage/SettingsPage';
import AudioWrapper from '@/components/HOCs/AudioWrapper';

const breakpoints = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

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
      const windowWidth = window.innerWidth;
      let newBreakpoint = '';

      for (const breakpoint in breakpoints) {
        if (windowWidth < breakpoints[breakpoint]) {
          newBreakpoint = breakpoint;
          break;
        }
      }

      run(setBreakpoint(newBreakpoint || 'xxl'));
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
                      <UserWrapper>
                        <QuizManagementLayout>
                          <CollectionListPage />
                        </QuizManagementLayout>
                      </UserWrapper>
                    </AdminRoute>
                  </ProtectedRoute>
                )}
              />
              <Route
                path={routePaths.COLLECTION_DETAIL}
                element={(
                  <ProtectedRoute>
                    <AdminRoute>
                      <UserWrapper>
                        <QuizManagementLayout>
                          <CollectionDetailPage />
                        </QuizManagementLayout>
                      </UserWrapper>
                    </AdminRoute>
                  </ProtectedRoute>
                )}
              />
              <Route
                path={routePaths.REPORTS}
                element={(
                  <ProtectedRoute>
                    <AdminRoute>
                      <UserWrapper>
                        <QuizManagementLayout>
                          <ReportsPage />
                        </QuizManagementLayout>
                      </UserWrapper>
                    </AdminRoute>
                  </ProtectedRoute>
                )}
              />
              <Route
                path={routePaths.QUIZZES}
                element={(
                  <ProtectedRoute>
                    <AdminRoute>
                      <UserWrapper>
                        <QuizManagementLayout>
                          <QuizListPage />
                        </QuizManagementLayout>
                      </UserWrapper>
                    </AdminRoute>
                  </ProtectedRoute>
                )}
              />
              <Route
                path={routePaths.QUIZ_DETAIL}
                element={(
                  <ProtectedRoute>
                    <AdminRoute>
                      <UserWrapper>
                        <QuizManagementLayout>
                          <QuizDetailPage />
                        </QuizManagementLayout>
                      </UserWrapper>
                    </AdminRoute>
                  </ProtectedRoute>
                )}
              />

              <Route
                path={routePaths.HOME}
                element={(
                  <ProtectedRoute>
                    <UserWrapper>
                      <QuizLayout>
                        <HomePage />
                      </QuizLayout>
                    </UserWrapper>
                  </ProtectedRoute>
                )}
              />
              <Route
                path={routePaths.JOIN}
                element={(
                  <ProtectedRoute>
                    <UserWrapper>
                      <AudioWrapper>
                        <JoinPage />
                      </AudioWrapper>
                    </UserWrapper>
                  </ProtectedRoute>
                )}
              />
              <Route
                path={routePaths.QUIZ}
                element={(
                  <ProtectedRoute>
                    <UserWrapper>
                      <AudioWrapper>
                        <QuizPage />
                      </AudioWrapper>
                    </UserWrapper>
                  </ProtectedRoute>
                )}
              />
              <Route
                path={routePaths.PROFILE}
                element={(
                  <ProtectedRoute>
                    <UserWrapper>
                      <QuizLayout>
                        <ProfilePage />
                      </QuizLayout>
                    </UserWrapper>
                  </ProtectedRoute>
                )}
              />
              <Route
                path={routePaths.SETTINGS}
                element={(
                  <ProtectedRoute>
                    <UserWrapper>
                      <QuizLayout>
                        <SettingsPage />
                      </QuizLayout>
                    </UserWrapper>
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
