import { RightOutlined } from '@ant-design/icons';
import { Badge, Col, Empty, Row } from 'antd';
import { isEmpty } from 'lodash';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '@/constants/routePaths';
import QuizCard from '@/components/app/student/Home/QuizCard/QuizCard';
import './ClientQuizList.scss';

interface QuizListProps {
  data?: Array<any>;
  title?: string;
  showSeeMore?: boolean;
  span?: any;
  statuses? : Array<string>;
  total?: number;
}

const ClientQuizList: React.FC<QuizListProps> = ({ data = [], title, showSeeMore = true, span = 6, statuses = [], total = 0 }) => {
  const navigate = useNavigate();

  const handleSeeMore = () => {
    const encodedParams = encodeURIComponent(statuses.join(','));
    navigate(`${routePaths.LIST}?statuses=${encodedParams}`);
  };

  return (
    <div className="client-quiz-list">
      <div className="client-quiz-list-header">
        <div className="header-left">
          <h2 className="quiz-list-title">{title}</h2>
          <Badge count={total} />
        </div>
        { showSeeMore ? (
          <div className="see-more-button" onClick={handleSeeMore}>
            <span> See more</span>
            <RightOutlined />
          </div>
        ) : null}
      </div>
      <div className={`${showSeeMore ? 'home' : ''} list-container ${isEmpty(data) ? 'empty' : ''}`}>
        {isEmpty(data)
          ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <Row className="list" gutter={[12, 24]}>
              {data.map(item => (
                <Col span={span} key={item?._id}>
                  <QuizCard data={item} status={item.status} />
                </Col>
              ))}
            </Row>
          )}
      </div>

    </div>
  );
};

export default ClientQuizList;
