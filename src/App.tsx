import { HashRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider, useStore } from './lib/store'
import { Layout } from './components/Layout'
import { AlertTriangle, LoaderCircle } from 'lucide-react'
import Home from './pages/Home'
import Phones from './pages/Phones'
import PhoneDetail from './pages/PhoneDetail'
import Screens from './pages/Screens'
import Parts from './pages/Parts'
import Firmware from './pages/Firmware'
import Tools from './pages/Tools'
import Maintenance from './pages/Maintenance'
import Programming from './pages/Programming'
import Cybersecurity from './pages/Cybersecurity'
import Faults from './pages/Faults'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import Requests from './pages/Requests'
import Contact from './pages/Contact'
import SearchPage from './pages/SearchPage'
import Sources from './pages/Sources'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import { Privacy, Terms } from './pages/Legal'

function Boot({ children }: { children: React.ReactNode }) {
  const { ready, error, lang } = useStore()
  if (error) {
    return (
      <div className="boot-screen">
        <span className="boot-error"><AlertTriangle size={26} /></span>
        <h1>{lang === 'ar' ? 'تعذر تهيئة قاعدة البيانات المحلية' : 'Could not initialise the local database'}</h1>
        <p>{error}</p>
        <button className="btn btn-primary btn-md" onClick={() => window.location.reload()}>{lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}</button>
      </div>
    )
  }
  if (!ready) {
    return (
      <div className="boot-screen">
        <div className="boot-mark">B<span>.</span></div>
        <div className="boot-line"><LoaderCircle size={18} className="spin" />{lang === 'ar' ? 'نجهّز المكتبة التقنية…' : 'Preparing the technical library…'}</div>
        <small>WHITE BLACK · brxvih</small>
      </div>
    )
  }
  return <>{children}</>
}

export default function App() {
  return (
    <HashRouter>
      <StoreProvider>
        <Boot>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/phones" element={<Phones />} />
              <Route path="/phones/:id" element={<PhoneDetail />} />
              <Route path="/screens" element={<Screens />} />
              <Route path="/parts" element={<Parts />} />
              <Route path="/firmware" element={<Firmware />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/programming" element={<Programming />} />
              <Route path="/cybersecurity" element={<Cybersecurity />} />
              <Route path="/faults" element={<Faults />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:slug" element={<ArticleDetail />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/sources" element={<Sources />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Boot>
      </StoreProvider>
    </HashRouter>
  )
}
