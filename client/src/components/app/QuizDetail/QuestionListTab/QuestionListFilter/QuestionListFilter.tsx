import { Button, Col, Form, Row, Select } from 'antd';
import { FormLayout } from 'antd/es/form/Form';
import React, { useEffect, useMemo, useState } from 'react';
import useTypedSelector from '@/hooks/useTypedSelector';
import { QuestionLevelEnums, QuestionTypeEnums } from '@/constants';
import './QuestionListFilter.scss';

const { Item } = Form;

const colLayouts = {
  xs: 24,
  lg: 12,
  xl: 6,
};

const FormLayoutEnums: any = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
};

const QuestionListFilter = ({ setFilter, filter }: {setFilter: any, filter: any}) => {
  const [formLayout, setFormLayout] = useState<FormLayout | undefined>(() => (window.innerWidth >= 1200 ? 'vertical' : 'horizontal'));
  const { windowWidth } = useTypedSelector((state) => state.app);

  const typeOptions = useMemo(() => {
    const arr = Object.entries(QuestionTypeEnums);

    return arr.map(([key, value]) => ({ label: value, value: key }));
  }, []);

  const levelOptions = useMemo(() => {
    const arr = Object.entries(QuestionLevelEnums);

    return arr.map(([key, value]) => ({ label: value, value: key }));
  }, []);

  const handleTypeChange = (value) => {
    setFilter(prev => ({ ...prev, type: value }));
  };

  const handleLevelChange = (value) => {
    setFilter(prev => ({ ...prev, level: value }));
  };

  const handleResetClick = () => {
    setFilter({ type: [], level: [], search: '' });
  };

  useEffect(() => {
    if (windowWidth >= 1200) {
      setFormLayout(FormLayoutEnums.VERTICAL);
      return;
    }

    setFormLayout(FormLayoutEnums.HORIZONTAL);
  }, [windowWidth]);

  return (
    <Form className="question-list-filter" layout={formLayout}>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col {...colLayouts}>
          <Item
            label="Type"
          >
            <Select
              maxTagCount="responsive"
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={handleTypeChange}
              options={typeOptions}
              value={filter.type}
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            />
          </Item>
        </Col>

        <Col {...colLayouts}>
          <Item
            label="Level"
          >
            <Select
              mode="multiple"
              maxTagCount="responsive"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={handleLevelChange}
              value={filter.level}
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={levelOptions}
            />
          </Item>
        </Col>

        <Col>
          <Item label={formLayout === FormLayoutEnums.VERTICAL ? ' ' : ''}>
            <Button onClick={handleResetClick} style={{ padding: 0 }} type="link" block>
              Reset
            </Button>
          </Item>
        </Col>
      </Row>
    </Form>
  );
};

export default QuestionListFilter;
