import React, { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import CollectionListToolbar from '@/components/app/CollectionList/MyCollectionsTab/CollectionListToolbar/CollectionListToolbar';
import CollectionList from '@/components/app/CollectionList/MyCollectionsTab/CollectionList/CollectionList';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import { Collection } from '@/types/collection';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import { getCollections } from '@/actions/collection';
import { UNEXPECTED_ERROR_MESSAGE } from '@/constants/message';

const MyCollectionTab = () => {
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
          const response = await run(getCollections({ ...params }));
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
    <div className="my-collection-tab">
      <CollectionListToolbar />
      <CollectionList data={collections} total={total} tableLoading={loading} />
    </div>
  );
};

export default MyCollectionTab;