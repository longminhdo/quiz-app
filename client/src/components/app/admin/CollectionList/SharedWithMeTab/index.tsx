import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getCollections } from '@/actions/collection';
import { UNEXPECTED_ERROR_MESSAGE } from '@/constants/message';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import { Collection } from '@/types/collection';
import CollectionListToolbar from '@/components/app/admin/CollectionList/MyCollectionsTab/CollectionListToolbar/CollectionListToolbar';
import CollectionList from '@/components/app/admin/CollectionList/MyCollectionsTab/CollectionList/CollectionList';

const SharedWithMeTab: React.FC = () => {
  const [collections, setCollections] = useState<Array<Collection>>([]);
  const [total, setTotal] = useState<number>(0);

  const debounce = useRef<any>();

  const [run, loading] = useDispatchAsyncAction();
  const { currentParams } = useUpdateUrlQuery();

  const [messageApi] = message.useMessage();

  useEffect(() => {
    (() => {
      clearTimeout(debounce.current);

      debounce.current = setTimeout(async () => {
        try {
          const params = { ...currentParams };
          params?.timestamp && delete params.timestamp;
          const response = await run(getCollections({ ...params, getShared: true }));
          if (response?.statusCode === 200) {
            setCollections(response.data.data || []);
            setTotal(response.data.pagination?.total);
          }
        } catch (error) {
          messageApi.error(UNEXPECTED_ERROR_MESSAGE);
        }
      }, 250);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageApi, run, window.location.href]);

  return (
    <div className="shared-with-me-tab">
      <CollectionListToolbar />
      <CollectionList data={collections} total={total} tableLoading={loading} />
    </div>
  );
};

export default SharedWithMeTab;
