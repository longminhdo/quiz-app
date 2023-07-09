import { isEmpty, isEqual } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { flushCollection, getCollectionById } from '@/actions/collection';
import QuestionList from '@/components/app/CollectionDetail/QuestionListTab/QuestionList/QuestionList';
import QuestionListFilter from '@/components/app/CollectionDetail/QuestionListTab/QuestionListFilter/QuestionListFilter';
import QuestionListToolbar from '@/components/app/CollectionDetail/QuestionListTab/QuestionListToolbar/QuestionListToolbar';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from '@/hooks/useTypedSelector';
import { setLoading } from '@/modules/redux/slices/appReducer';
import { Collection } from '@/types/collection';

const QuestionListTab = () => {
  const [collection, setCollection] = useState<Collection>();
  const [filter, setFilter] = useState<{search: string, type: Array<string>, level: Array<string>}>({ search: '', type: [], level: [] });

  const childRef = useRef<any>();
  const filterRef = useRef<any>();
  const collectionRef = useRef<any>();

  const { currentCollection } = useTypedSelector((state) => state.collection);
  const [run] = useDispatchAsyncAction();
  const { collectionId } = useParams();

  const handleAddQuestion = () => {
    childRef?.current?.createNewQuestion && childRef.current.createNewQuestion();
  };

  // effect for fetching
  useEffect(() => {
    if (!collectionId) {
      return () => undefined;
    }

    (async () => {
      run(setLoading(true));
      await run(getCollectionById(collectionId));

      run(setLoading(false));
    })();

    return () => {
      run(flushCollection());
      return undefined;
    };
  }, [collectionId, run]);

  // effect for locally filtering
  useEffect(() => {
    if (isEmpty(currentCollection)) {
      return;
    }

    if (isEqual(filterRef.current, filter) && isEqual(currentCollection, collectionRef.current)) {
      return;
    }

    const { level, type, search } = filter;
    const newCollection = {
      ...currentCollection,
      questions: currentCollection?.questions?.filter(
        q => (isEmpty(level) ? true : level.includes(String(q.level)))
             && (isEmpty(type) ? true : type.includes(String(q.type)))
             && (isEmpty(search) ? true : q.title.toLowerCase().includes(search.toLowerCase())),
      ),
    };

    setCollection(newCollection);
    filterRef.current = filter;
    collectionRef.current = currentCollection;
  }, [currentCollection, filter, setCollection]);

  return (
    <>
      <QuestionListToolbar handleAddQuestion={handleAddQuestion} setFilter={setFilter} filter={filter} />
      <QuestionListFilter setFilter={setFilter} filter={filter} />
      <QuestionList collection={collection} ref={childRef} filter={filter} />
    </>
  );
};

export default QuestionListTab;