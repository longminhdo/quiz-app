import React, { useState } from 'react';
import { Pagination } from 'antd';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import './MyPagination.scss';

const MyPagination = ({ total } : {total:number}) => {
  const [page, setPage] = useState(() => Number(new URLSearchParams(window.location.search).get('offset') || 1));
  const [pageSize, setPageSize] = useState(() => Number(new URLSearchParams(window.location.search).get('limit') || 10));
  const { updateQuery } = useUpdateUrlQuery();

  const handlePaginationChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);

    updateQuery({
      query: {
        offset: page,
        limit: pageSize,
      },
    });
  };

  return (
    <div className="my-pagination">
      <Pagination
        showSizeChanger
        current={page}
        pageSize={pageSize}
        onChange={handlePaginationChange}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
        total={total}
        pageSizeOptions={[5, 10, 20, 50, 100]}
      />
    </div>
  );
};

export default MyPagination;