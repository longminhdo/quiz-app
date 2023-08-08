import { UserOutlined } from '@ant-design/icons';
import { Avatar, Descriptions, Spin } from 'antd';
import moment from 'moment';
import React from 'react';
import { GenderEnums } from '@/constants';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from '@/hooks/useTypedSelector';
import { convertLabel } from '@/utilities/helpers';
import './ProfilePage.scss';

const { Item } = Descriptions;

const infoList = [
  {
    label: 'Student ID',
    key: 'studentId',
  },
  {
    label: 'Year of enrollment',
    key: 'year',
  },
  {
    label: 'Gender',
    key: 'gender',
    transform: (v) => convertLabel(v, GenderEnums),
  },
  {
    label: 'Class',
    key: 'className',
  },
  {
    label: 'Student year',
    key: 'studentYear',
  },
  {
    label: 'Phone number:',
    key: 'phoneNumber',
  },
  {
    label: 'Date of birth',
    key: 'birthday',
    transform: (v) => moment(v).format('YYYY/MM/DD'),
  },
  {
    label: 'Email',
    key: 'email',
    span: 2,
  },
  {
    label: 'School',
    key: 'schoolName',
    span: 3,
  },
];

const getMaxSpan = (breakpoint) => {
  switch (breakpoint) {
    case 'xxl':
    case 'xl':
      return 3;
    case 'md':
    case 'lg':
      return 2;
    default:
      return 1;
  }
};

const ProfilePage: React.FC = () => {
  const [, loading] = useDispatchAsyncAction();
  const currentUser = useTypedSelector(state => state.user);
  const { breakpoint } = useTypedSelector(state => state.app);

  return (
    <Spin spinning={loading}>
      <div className="profile-page">
        <h1 className="page-title">Profile</h1>
        <div className="page-content">
          <div className="avatar-wrapper">
            {currentUser.avatar ? (
              <Avatar
                className="user-avatar"
                src={currentUser.avatar}
              />
            ) : (
              <Avatar
                className="user-avatar"
                icon={<UserOutlined />}
                style={{ fontSize: 96 }}
              />
            )}
          </div>

          <Descriptions title={currentUser.fullName} column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}>
            {infoList.map(item => {
              const value = currentUser?.[item.key];
              const span = Math.min(getMaxSpan(breakpoint), item?.span || 1);
              if (!value) {
                return null;
              }

              if (item?.transform) {
                return <Item span={span} key={item.key} label={item.label}>{item.transform(value)}</Item>;
              }

              return <Item span={span} key={item.key} label={item.label}>{value}</Item>;
            })}
          </Descriptions>
        </div>
      </div>
    </Spin>
  );
};

export default ProfilePage;
