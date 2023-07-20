import { SearchOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Checkbox, Input, Modal, Select } from 'antd';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useTypedSelector from '@/hooks/useTypedSelector';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import { addCollaborator } from '@/actions/collection';
import './ManageAccess.scss';

const { Grid } = Card;

const gridStyles = {
  width: '100%',
};

const addCollaboratorOptions = [
  { label: 'Viewer', value: 'viewer' },
  { label: 'Editor', value: 'editor' },
];

// TODO: manage access collection settings tab
const ManageAccess: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [checkedList, setCheckedList] = useState<any>([]);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [collaborators, setCollaborators] = useState<any>([]);
  const [search, setSearch] = useState('');
  const [newCollaborator, setNewCollaborator] = useState({ user: '', type: undefined });
  const [error, setError] = useState('');

  const { currentCollection } = useTypedSelector((state) => state.collection);
  const [run, loading] = useDispatchAsyncAction();

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    // fetch shared list
    if (isEmpty(currentCollection)) {
      return;
    }

    const { viewers, editors } = currentCollection;

    setCollaborators([...(viewers || []).map(item => ({ ...item, type: 'Viewer' })),
      ...(editors || []).map(item => ({ ...item, type: 'Editor' }))]);
  }, [currentCollection]);

  const handleAddPeople = () => {
    setOpen(true);
  };

  const handleCheckAll = useCallback((e) => {
    setCheckedList(e.target.checked ? [] : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  }, []);

  const onChange = (list) => {
    console.log(list);
    // setCheckedList(list);
    // setIndeterminate(!!list.length && list.length < accesses.length);
    // setCheckAll(list.length === accesses.length);
  };

  const handleOk = async() => {
    const res = await run(addCollaborator({ collaborator: newCollaborator, collectionId: currentCollection?._id }));
    if (!res?.success) {
      setError(res?.data);
      return;
    }

    setOpen(false);
    setError('');
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const RemoveButton = useMemo(() => <Button danger>Remove</Button>, []);

  const CardTitle = useMemo(() => (
    <div>
      <Checkbox indeterminate={indeterminate} onChange={handleCheckAll} checked={checkAll}>
        Check all
      </Checkbox>
    </div>
  ), [checkAll, handleCheckAll, indeterminate]);

  return (
    <div className="manage-access">
      <div className="toolbar">
        <p className="title">Manage access</p>
        <Button type="primary" onClick={handleAddPeople}>Add people</Button>
      </div>
      <Card type="inner" title={CardTitle} extra={RemoveButton}>
        <Grid style={{ ...gridStyles, paddingTop: 18, paddingBottom: 18 }} hoverable={false}>
          <Input
            placeholder="search"
            prefix={<SearchOutlined />}
            value={search}
            allowClear
            onChange={handleSearchChange}
          />
        </Grid>
        <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column' }} onChange={onChange}>
          {collaborators.map(c => (
            <Grid style={gridStyles} hoverable={false}>
              <Checkbox value="A" className="collaborator">
                <div className="collaborator-content">
                  <div className="user-item">
                    { c?.avatar ? <Avatar src={c?.avatar} /> : <Avatar icon={<UserOutlined />} />}
                    <div className="user-item-info">
                      <span>
                        {c?.email}
                      </span>
                      <span>
                        {c?.type}
                      </span>
                    </div>
                  </div>
                </div>
              </Checkbox>
              <Button>Remove</Button>
            </Grid>
          )) }
        </Checkbox.Group>
      </Card>

      <Modal
        okButtonProps={{ disabled: !(newCollaborator?.type && newCollaborator?.user) }}
        open={open}
        onOk={handleOk}
        confirmLoading={loading}
        onCancel={handleCancel}
        destroyOnClose
        className="add-collaborator-modal"
      >
        <div className="header">
          <TeamOutlined style={{ fontSize: 48 }} />
          <div className="title">
            Add a collaborator to
            {' '}
            <span className="collection-title">{currentCollection?.title}</span>
          </div>
        </div>
        <div className="main">
          <div className="input-wrapper">
            <Input
              status={error ? 'error' : ''}
              allowClear
              placeholder="Search by ID or email."
              value={newCollaborator.user}
              onChange={(e) => {
                setError('');
                setNewCollaborator(prev => ({ ...prev, user: e.target.value }));
              }}
            />
            {error && <p className="error-message">{error}</p>}
          </div>

          <Select
            allowClear
            style={{ width: '100%' }}
            placeholder="Collaborator type"
            options={addCollaboratorOptions}
            value={newCollaborator.type}
            onChange={(v) => { setNewCollaborator(prev => ({ ...prev, type: v })); }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ManageAccess;
