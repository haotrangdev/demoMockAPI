import { ConfigProvider, Layout, Tabs, Typography } from 'antd'
import viVN from 'antd/locale/vi_VN'
import UserList from './components/UserList'
import TeamInfo from './components/TeamInfo'

const { Header, Content } = Layout

export default function App() {
  return (
    <ConfigProvider locale={viVN}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
            Quản lý danh sách người dùng
          </Typography.Title>
        </Header>
        <Content style={{ padding: 24, maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          <Tabs
            items={[
              { key: 'list', label: 'Danh sách', children: <UserList /> },
              { key: 'team', label: 'Thông tin nhóm', children: <TeamInfo /> },
            ]}
          />
        </Content>
      </Layout>
    </ConfigProvider>
  )
}
