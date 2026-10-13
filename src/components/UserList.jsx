import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Descriptions, Empty, Input, Pagination, Row, Segmented, Select, Space, Spin, Table } from 'antd'
import { AppstoreOutlined, SortAscendingOutlined, SortDescendingOutlined, TableOutlined } from '@ant-design/icons'
import { orderBy } from 'lodash-es'
import { API_URL, FIELDS, PAGE_SIZE, SEARCH_FIELD } from '../config'

// Bỏ dấu + chữ thường để tìm kiếm tiếng Việt thuận tiện hơn
const normalize = (s = '') => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const sortableFields = FIELDS.filter((f) => f.sortable)

export default function UserList() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [view, setView] = useState('grid')
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState({ field: undefined, order: 'asc' })
  const [page, setPage] = useState(1)

  useEffect(() => {
    const controller = new AbortController()
    fetch(API_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setData)
      .catch((e) => e.name !== 'AbortError' && setError(e.message))
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  const processed = useMemo(() => {
    const kw = normalize(keyword.trim())
    const filtered = kw ? data.filter((item) => normalize(item[SEARCH_FIELD]).includes(kw)) : data
    if (!sort.field) return filtered
    const f = FIELDS.find((x) => x.key === sort.field)
    const iteratee = (item) =>
      f.type === 'number' ? Number(item[f.key]) : String(item[f.key] ?? '').toLowerCase()
    return orderBy(filtered, [iteratee], [sort.order])
  }, [data, keyword, sort])

  const pageItems = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const updateSort = (patch) => {
    setSort((s) => ({ ...s, ...patch }))
    setPage(1)
  }

  const columns = FIELDS.map((f) => ({
    title: f.title,
    dataIndex: f.key,
    render: f.render,
    sorter: f.sortable,
    sortOrder: sort.field === f.key ? (sort.order === 'asc' ? 'ascend' : 'descend') : null,
  }))

  const handleTableChange = (_p, _f, sorter) => {
    updateSort(
      sorter.order
        ? { field: sorter.field, order: sorter.order === 'ascend' ? 'asc' : 'desc' }
        : { field: undefined }
    )
  }

  if (error) return <Alert type="error" showIcon message="Không tải được dữ liệu" description={error} />

  return (
    <Spin spinning={loading}>
      <Space wrap style={{ marginBottom: 16, width: '100%' }}>
        <Input.Search
          allowClear
          placeholder="Tìm theo tên..."
          style={{ width: 280 }}
          onChange={(e) => {
            setKeyword(e.target.value)
            setPage(1)
          }}
        />
        <Select
          allowClear
          placeholder="Sắp xếp theo"
          style={{ width: 160 }}
          value={sort.field}
          onChange={(field) => updateSort({ field })}
          options={sortableFields.map((f) => ({ value: f.key, label: f.title }))}
        />
        <Button
          disabled={!sort.field}
          icon={sort.order === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
          onClick={() => updateSort({ order: sort.order === 'asc' ? 'desc' : 'asc' })}
        >
          {sort.order === 'asc' ? 'Tăng dần' : 'Giảm dần'}
        </Button>
        <Segmented
          value={view}
          onChange={setView}
          options={[
            { value: 'grid', icon: <AppstoreOutlined />, label: 'Grid' },
            { value: 'table', icon: <TableOutlined />, label: 'Table' },
          ]}
        />
        <span>{processed.length} kết quả</span>
      </Space>

      {view === 'table' ? (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={processed}
          onChange={handleTableChange}
          scroll={{ x: true }}
          pagination={{ current: page, pageSize: PAGE_SIZE, onChange: setPage, showSizeChanger: false }}
        />
      ) : pageItems.length ? (
        <>
          <Row gutter={[16, 16]}>
            {pageItems.map((item) => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <Card title={item.hoten} extra={`#${item.id}`} size="small" hoverable>
                  <Descriptions column={1} size="small">
                    {FIELDS.filter((f) => f.key !== 'id' && f.key !== SEARCH_FIELD).map((f) => (
                      <Descriptions.Item key={f.key} label={f.title}>
                        {f.render ? f.render(item[f.key]) : item[f.key]}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </Card>
              </Col>
            ))}
          </Row>
          <Pagination
            style={{ marginTop: 16, textAlign: 'center' }}
            current={page}
            pageSize={PAGE_SIZE}
            total={processed.length}
            onChange={setPage}
            showSizeChanger={false}
          />
        </>
      ) : (
        !loading && <Empty description="Không có kết quả phù hợp" />
      )}
    </Spin>
  )
}
