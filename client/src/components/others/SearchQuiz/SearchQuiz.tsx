import { SearchOutlined } from '@ant-design/icons';
import { Input, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUserQuizzes } from '@/actions/userQuiz';
import { UNEXPECTED_ERROR_MESSAGE } from '@/constants/message';
import { routePaths } from '@/constants/routePaths';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import './SearchQuiz.scss';

const SearchQuiz: React.FC = () => {
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const [searchOptions, setSearchOptions] = useState<any>([]);

  const navigate = useNavigate();
  const [run] = useDispatchAsyncAction();

  const debounce = useRef<any>();

  const handleChange = (e) => {
    const value = e.target.value;

    if (!value) {
      setShow(false);
      setSearchOptions([]);
    }
    setSearch(e.target.value);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShow(false);
    }, 200);
  };

  const handleFocus = () => {
    if (!search) {
      setShow(false);
      return;
    }

    setShow(true);
  };

  const handleItemClick = (id) => {
    navigate(routePaths.QUIZ.replace(':userQuizId', id));
  };

  useEffect(() => {
    if (searchOptions?.length > 0) {
      setShow(true);
    }
  }, [searchOptions]);

  useEffect(() => {
    if (!search) {
      return;
    }

    (() => {
      clearTimeout(debounce.current);

      debounce.current = setTimeout(async () => {
        try {
          const response = await run(searchUserQuizzes({ search }));
          if (response?.statusCode === 200) {
            setSearchOptions(response.data.data || []);
          }
        } catch (error) {
          message.error(UNEXPECTED_ERROR_MESSAGE);
        }
      }, 250);
    })();
  }, [run, search]);
  return (
    <div className="search-quiz">
      <Input
        size="large"
        value={search}
        placeholder="Search quiz..."
        allowClear
        prefix={<SearchOutlined />}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      {show && searchOptions?.length > 0 && (
      <div className="search-result-popup">
        {searchOptions.map(item => (
          <span
            className="search-result-item"
            key={item?._id}
            onClick={() => handleItemClick(item?._id)}
          >
            {item.title}
          </span>
        ))}
      </div>
      )}
    </div>
  );
};

export default SearchQuiz;
