import { Col, Empty, Row } from 'antd';
import { isEmpty } from 'lodash';
import React from 'react';
import QuizCard from '@/components/app/student/Home/QuizCard/QuizCard';
import './ClientQuizList.scss';

interface QuizListProps {
  data?: Array<any>;
  title?: string;
}

const ClientQuizList: React.FC<QuizListProps> = ({ data, title }) => {
  console.log('first', data);
  return (
    <div className="client-quiz-list">
      <h2 className="quiz-list-title">{title}</h2>
      <div className={`list-container ${isEmpty(data) ? 'empty' : ''}`}>
        {isEmpty(data)
          ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <Row className="list" gutter={24}>
              {data?.map(item => (
                <Col span={6} key={item?._id}>
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
