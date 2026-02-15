import { Provider } from 'react-redux'
import { ConfigProvider, App } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import deDE from 'antd/locale/de_DE'
import enUS from 'antd/locale/en_US'
import store from './store'
import { WebCxtProvider } from './services/WebCxt'
import { MessagesProvider } from './services/msgCxt'

import 'x402-react/styles'
import { useIpInfos } from './hooks/useIpInfos'


const AppProviders = ({ children }) => {
  // 获取语言对应的 locale
  const getLocale = () => {   
    const { ipInfo } = useIpInfos()
    const lang = ipInfo?.languages || 'en'
    switch (lang) {
      case 'zh':
      case 'zh-CN':
      case 'zh-Hans':
        return zhCN
      case 'de':
      case 'de-DE':
        return deDE
      default:
        return enUS
    }
  }

  return (
    <ConfigProvider
      locale={getLocale()}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 4,
        },
      }}
    >
      <App>
        <Provider store={store}>
          <WebCxtProvider>
            <MessagesProvider>
              {children}
            </MessagesProvider>
          </WebCxtProvider>
        </Provider>
      </App>
    </ConfigProvider>
  )
}

export default AppProviders