import React, { useState } from 'react';
import { Pagination } from 'antd';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import './MyPagination.scss';

const MyPagination = (
  { total,
    onChange,
    willUpdateQuery = true,
    customPagination,
  } : {
    willUpdateQuery?: boolean,
    total:number,
    onChange?: any,
    customPagination?: any,
  },
) => {
  const [localPage, setLocalPage] = useState(() => Number(new URLSearchParams(window.location.search).get('offset') || 1));
  const [localPageSize, setLocalPageSize] = useState(() => Number(new URLSearchParams(window.location.search).get('limit') || 10));
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

  return (
    <div className="my-pagination">
      <Pagination
        showSizeChanger
        current={customPagination?.page || localPage}
        pageSize={customPagination?.pageSize || localPageSize}
        onChange={handlePaginationChange}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
        total={total}
        pageSizeOptions={[5, 10, 20, 50, 100]}
      />
    </div>
  );
};

export default MyPagination;