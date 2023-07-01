import {
  DeleteOutlined,
  FontSizeOutlined,
  MoreOutlined,
  SelectOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Input, Modal, Popover } from 'antd';
import moment from 'moment';
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyTooltipIcon from '@/components/common/MyTooltipIcon/MyTooltipIcon';
import { FormGeneralDataType } from '@/constants/dataType';
import { routePaths } from '@/constants/routePaths';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import { setLoading } from '@/modules/redux/slices/appReducer';
import './FormsListViewItem.scss';

interface FormsListViewItemProps {
  forms: Array<FormGeneralDataType>;
  title: string;
}

const ItemRow = ({ form, showModal }: { form: FormGeneralDataType; showModal: any }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { updateQuery } = useUpdateUrlQuery();
  const [run] = useDispatchAsyncAction();

  const handleItemClick = () => {
    navigate(routePaths.FORM_QUESTIONS.replace(/:id/, form._id || ''));
  };

  const handleMoreIconClick = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();

    setOpen(true);
  };

  const convertTime = useCallback((time: number) => {
    if (!time) {
      return '';
    }

    return moment.unix(time).format('MMM DD, YYYY');
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleFormRemove = useCallback(
    async (e) => {
      e.stopPropagation();
      e.preventDefault();
      setOpen(false);

      run(setLoading(true));
      // await run(deleteForm(form._id));
      updateQuery({
        query: {
          timeStamp: Date.now(),
        },
      });
      run(setLoading(false));
    },
    [run, updateQuery],
  );

  const handleNewTabClick = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      setOpen(false);

      window.open(routePaths.FORM_QUESTIONS.replace(/:id/, form._id || ''));
    },
    [form._id],
  );

  const handleRenameClick = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();

      showModal(form);

      setOpen(false);
    },
    [form, showModal],
  );

  const listViewItemPopover = useMemo(
    () => (
      <>
        <div className="my-popover-overlay-content-item" onClick={handleRenameClick}>
          <FontSizeOutlined className="my-popover-overlay-content-item-new-tab-icon" />
          <span>Rename</span>
        </div>
        <div
          className="my-popover-overlay-content-item my-popover-overlay-content-item-new-tab"
          onClick={handleNewTabClick}
        >
          <SelectOutlined className="my-popover-overlay-content-item-new-tab-icon" />
          <span>Open in new tab</span>
        </div>
        <div className="my-popover-overlay-content-item" onClick={handleFormRemove}>
          <DeleteOutlined />
          <span>Remove</span>
        </div>
      </>
    ),
    [handleFormRemove, handleNewTabClick, handleRenameClick],
  );

  return (
    <div className="item-row" onClick={handleItemClick}>
      <div className="item-row-icon">
        <UnorderedListOutlined />
      </div>

      <div className="item-row-title">{form.title}</div>

      <div className="item-row-date">{convertTime(form.updatedAt)}</div>
      <Popover
        open={open}
        overlayClassName="my-popover-overlay-content "
        trigger="click"
        placement="bottomRight"
        className="icon"
        content={listViewItemPopover}
        onOpenChange={handleOpenChange}
      >
        <MyTooltipIcon
          title={undefined}
          className="item-row-more-icon"
          onClick={handleMoreIconClick}
        >
          <MoreOutlined />
        </MyTooltipIcon>
      </Popover>
    </div>
  );
};

const FormsListViewItem: FunctionComponent<FormsListViewItemProps> = ({ forms, title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<any>();
  const { updateQuery } = useUpdateUrlQuery();
  const [run, loading] = useDispatchAsyncAction();

  const showModal = (form: FormGeneralDataType) => {
    setSelectedForm(form);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    // await run(updateForm(selectedForm));
    updateQuery({ query: { timestamp: Date.now() } });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleFormTitleChange = (e) => {
    setSelectedForm((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const handleKeyDown = (e) => {
    if (!selectedForm?.title) {
      return;
    }

    if (e.keyCode === 13) {
      e.preventDefault();
      handleOk();
    }
  };

  return (
    <div className="forms-list-view-item">
      <b className="title">{title}</b>
      {forms.map((form) => (
        <ItemRow key={form._id} form={form} showModal={showModal} />
      ))}

      <Modal
        confirmLoading={loading}
        title="Rename"
        okButtonProps={{ disabled: !selectedForm?.title }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName="form-rename-modal"
        destroyOnClose
      >
        <p>Please enter a new name for the item:</p>
        <Input
          value={selectedForm?.title}
          onChange={handleFormTitleChange}
          onKeyDown={handleKeyDown}
        />
      </Modal>
    </div>
  );
};

export default FormsListViewItem;
