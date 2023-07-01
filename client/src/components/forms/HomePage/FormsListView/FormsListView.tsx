import moment from 'moment';
import React, { useEffect, useState } from 'react';
import FormsListViewItem from '@/components/forms/HomePage/FormsListViewItem/FormsListViewItem';
import { FormGeneralDataType } from '@/constants/dataType';
import './FormsListView.scss';

interface ProcessedFormDataType {
  title: string;
  forms: Array<FormGeneralDataType>;
}

const FormsListView = ({
  forms = [],
} : {
  forms: Array<FormGeneralDataType>;
}) => {
  const [processedData, setProcessedData] = useState<Array<ProcessedFormDataType>>([]);

  useEffect(() => {
    if (forms?.length < 1) {
      setProcessedData([]);

      return;
    }

    //fragmentation
    const tmp = [...forms].sort((a, b) => b.updatedAt - a.updatedAt);

    const todayList: ProcessedFormDataType = { title: 'Today', forms: [] };
    const yesterdayList: ProcessedFormDataType = {
      title: 'Yesterday',
      forms: [],
    };
    const previous7DaysList: ProcessedFormDataType = {
      title: 'Previous 7 days',
      forms: [],
    };
    const previous30DaysList: ProcessedFormDataType = {
      title: 'Previous 30 days',
      forms: [],
    };
    const earlierList: ProcessedFormDataType = { title: 'Earlier', forms: [] };

    const today = moment();

    tmp.forEach((form) => {
      const diff = today.diff(moment.unix(form.updatedAt), 'days');
      if (diff === 0) {
        todayList.forms.push(form);
      } else if (diff === 1) {
        yesterdayList.forms.push(form);
      } else if (diff <= 7 && diff > 1) {
        previous7DaysList.forms.push(form);
      } else if (diff <= 30 && diff > 7) {
        previous30DaysList.forms.push(form);
      } else {
        earlierList.forms.push(form);
      }
    });

    setProcessedData([
      todayList,
      yesterdayList,
      previous7DaysList,
      previous30DaysList,
      earlierList,
    ]);
  }, [forms]);

  return (
    <div className="forms-list-view">
      {processedData
        .filter((data) => data.forms?.length)
        .map((data) => (
          <FormsListViewItem
            forms={data.forms}
            title={data.title}
            key={data.title}
          />
        ))}
    </div>
  );
};

export default FormsListView;
