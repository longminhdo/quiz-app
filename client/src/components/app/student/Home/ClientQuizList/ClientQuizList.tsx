import { Col, Row } from 'antd';
import React from 'react';
import QuizCard from '@/components/app/student/Home/QuizCard/QuizCard';
import './ClientQuizList.scss';

interface QuizListProps {
  data?: Array<any>;
  title?: string;
  status?: string;
}

const ClientQuizList: React.FC<QuizListProps> = ({ data, title, status }) => {
  console.log('first');
  return (
    <div className="client-quiz-list">
      <h2 className="quiz-list-title">{title}</h2>
      <Row className="list" gutter={24}>
        {data?.map(item => (
          <Col span={6} key={item?._id}>
            <QuizCard data={item} status={status} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ClientQuizList;
