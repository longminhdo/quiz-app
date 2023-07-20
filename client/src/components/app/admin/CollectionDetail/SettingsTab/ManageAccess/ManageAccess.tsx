import { SearchOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Checkbox, Input, Modal, Select } from 'antd';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { addCollaborator, updateCollection } from '@/actions/collection';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from '@/hooks/useTypedSelector';
import { setLoading } from '@/modules/redux/slices/appReducer';
import './ManageAccess.scss';

const { Grid } = Card;

const gridStyles = {
  width: '100%',
};

const addCollaboratorOptions = [
  { label: 'Viewer', value: 'viewer' },
  { label: 'Editor', value: 'editor' },
];

const DEFAULT_COLLABORATOR = { user: '', type: undefined };

const ManageAccess: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedCollaborators, setSelectedCollaborators] = useState<any>([]);
  const [viewingCollaborators, setViewingCollaborators] = useState<any>([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [collaborators, setCollaborators] = useState<any>([]);
  const [search, setSearch] = useState('');
  const [newCollaborator, setNewCollaborator] = useState(DEFAULT_COLLABORATOR);
  const [error, setError] = useState('');

  const { currentCollection } = useTypedSelector((state) => state.collection);
  const [run, loading] = useDispatchAsyncAction();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value) {
      setViewingCollaborators(collaborators);
    }

    setViewingCollaborators(collaborators?.filter(c => c?.email?.toLowerCase().includes(value?.toLowerCase())));
  };

  useEffect(() => {
    if (isEmpty(currentCollection)) {
      return;
    }

    const { viewers, editors } = currentCollection;
    const currentCollaborators = [...(viewers || []).map(item => ({ ...item, type: 'Viewer' })),
      ...(editors || []).map(item => ({ ...item, type: 'Editor' }))];

    setCollaborators(currentCollaborators);
    setViewingCollaborators(currentCollaborators);
  }, [currentCollection]);

  const handleAddPeople = () => {
    setOpen(true);
  };

  const handleCheckAll = useCallback((e) => {
    setSelectedCollaborators(e.target.checked ? collaborators.map(item => item?._id) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  }, [collaborators]);

  const onChange = (list) => {
    setSelectedCollaborators(list);
    setIndeterminate(!!list.length && list.length < collaborators.length);
    setCheckAll(list.length === collaborators.length);
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
    setOpen(false);
    setTimeout(() => {
      setNewCollaborator(DEFAULT_COLLABORATOR);
      setError('');
    }, 50);
  };

  const removeCollaborators = useCallback(async (removeItems) => {
    let newEditors = currentCollection?.editors;
    let newViewers = currentCollection?.viewers;
    removeItems.forEach(itemToRemove => {
      newEditors = newEditors.filter(item => item?._id !== itemToRemove);
      newViewers = newViewers.filter(item => item?._id !== itemToRemove);
    });

    const newCollection = { ...currentCollection, editors: newEditors, viewers: newViewers };
    run(setLoading(true));
    await run(updateCollection(newCollection));
    run(setLoading(false));
  }, [currentCollection, run]);

  const RemoveAllButton = useMemo(() => (
    <Button
      type="primary"
      disabled={!selectedCollaborators.length}
      danger
      onClick={() => removeCollaborators(selectedCollaborators)}
    >
      Remove
    </Button>
  ), [removeCollaborators, selectedCollaborators]);

  const CardTitle = useMemo(() => (
    <div>
      <Checkbox
        indeterminate={indeterminate}
        onChange={handleCheckAll}
        checked={checkAll}
      >
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
      <Card type="inner" title={CardTitle} extra={RemoveAllButton}>
        <Grid style={{ ...gridStyles, paddingTop: 18, paddingBottom: 18 }} hoverable={false}>
          <Input
            placeholder="search"
            prefix={<SearchOutlined />}
            value={search}
            allowClear
            onChange={handleSearchChange}
          />
        </Grid>
        <Checkbox.Group
          style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
          onChange={onChange}
          value={selectedCollaborators}
        >
          {viewingCollaborators.map(c => (
            <Grid style={gridStyles} hoverable={false} key={c?._id}>
              <Checkbox value={c?._id} className="collaborator">
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
              <Button onClick={() => removeCollaborators([c?._id])} danger>Remove</Button>
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
