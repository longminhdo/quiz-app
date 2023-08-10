import { Pagination } from 'antd';
import React, { useState } from 'react';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import './MyPagination.scss';

interface MyPaginationProps {
  willUpdateQuery?: boolean;
  total:number;
  onChange?: any;
  customPagination?: any;
  showSizeChanger?: boolean;
  style?: any;
  showTotal?: boolean;
  defaultPageSize?: number;
}

const MyPagination: React.FC<MyPaginationProps> = ({
  total,
  onChange,
  willUpdateQuery = true,
  customPagination,
  showSizeChanger = true,
  showTotal = true,
  style = {},
  defaultPageSize = 10,
}) => {
  const [localPage, setLocalPage] = useState(() => Number(new URLSearchParams(window.location.search).get('offset') || 1));
  const [localPageSize, setLocalPageSize] = useState(() => Number(new URLSearchParams(window.location.search).get('limit') || defaultPageSize));
  const { updateQuery } = useUpdateUrlQuery();

  const handlePaginationChange = (newLocalPage, newLocalPageSize) => {
    setLocalPage(newLocalPage);
    setLocalPageSize(newLocalPageSize);
    onChange && onChange(newLocalPage, newLocalPageSize);
    willUpdateQuery && updateQuery({
      query: {
        offset: newLocalPage,
        limit: newLocalPageSize,
      },
    });
  };

  if (total === 0) {
    return null;
  }

  return (
    <div className="my-pagination" style={style}>
      <Pagination
        showSizeChanger={showSizeChanger}
        current={customPagination?.page || localPage}
        pageSize={customPagination?.pageSize || localPageSize}
        onChange={handlePaginationChange}
        showTotal={(total, range) => (showTotal ? `${range[0]}-${range[1]} of ${total} items` : null)}
        total={total}
        pageSizeOptions={[5, 10, 20, 50, 100]}
      />
    </div>
  );
};

export default MyPagination;