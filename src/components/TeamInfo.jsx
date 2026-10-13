import { Card, Descriptions, Table } from 'antd'
import { TEAM } from '../team'

const columns = [
  { title: 'STT', dataIndex: 'id', width: 2 },
  { title: 'Họ tên', dataIndex: 'name' },
  { title: 'MSSV', dataIndex: 'studentId' },
]

export default function TeamInfo() {
  return (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Descriptions title="Thông tin nhóm" column={1} bordered>
          <Descriptions.Item label="Tên nhóm">{TEAM.name}</Descriptions.Item>
        </Descriptions>
         <Table rowKey="id" columns={columns} dataSource={TEAM.members} pagination={false} scroll={{ x: true }} />
  
      </Card>
      
    </>
  )
}
