import './App.css'
import './styles/body.css'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/Home.jsx'
import RegisterPage from './pages/Register.jsx'
import LoginPage from './pages/Login.jsx'
import PaymentPage from './pages/Payment.jsx'
import AdditionalPaymentPage from './pages/AdditionalPayment.jsx'
import WithDrawthPaymentPage from './pages/WithDrawthPayment.jsx'
import ChangePasswordPage from './pages/ChangePasswordPage.jsx'
import NewPostPage from './pages/NewPostPage.jsx'
import NewGoodPostPage from './pages/NewGoodPostPage.jsx'
import ListOfGoodsPage from './pages/ListOfGoodsPage.jsx'
import FreelancerPage from './pages/FreelancerPage.jsx'
import DetailOfGoodsPage from './pages/DetailOfGoodsPage.jsx'
import NewFreelancerPostPage from './pages/NewFreelancerPostPage.jsx'
import AiLivePage from './pages/AiLivePage.jsx'
import AiLiveVideoDetailPageSpec from './pages/AiLiveVideoDetailPageSpec.jsx'
import AiLiveVideoDetailPage from './pages/AiLiveVideoDetailPage.jsx' 
import NewAiLivePostPage from './pages/NewAiLivePostPage.jsx'
import AdminControlPage from './pages/AdminControlPage.jsx'
import RewardListPage from './pages/RewardListPage.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import HomeWrapper from './pages/HomeWrapper.jsx'
function App() {

  return (
    <>
     <Routes>
        <Route exact path="/" element={<HomeWrapper />} />
        <Route exact path={import.meta.env.VITE_REACT_APP_QRLOGIN_PATH || '/qr-login'} element={<LoginPage />} />
        <Route exact path="/register" element={<RegisterPage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />

        <Route exact path="/list-of-goods" element={<ListOfGoodsPage />} />
        <Route exact path="/list-of-goods/:id" element={<DetailOfGoodsPage />} />

        <Route exact path="/freelancer" element={<FreelancerPage />} />
        <Route exact path="/detail-of-goods" element={<DetailOfGoodsPage />} />
         <Route exact path="/ai-live" element={<AiLivePage />} />
         <Route exact path="/ai-live/video/:id" element={<AiLiveVideoDetailPageSpec />} />
         <Route exact path="/ai-live/video-goods/:id" element={<AiLiveVideoDetailPage />} />

        {/* Protected routes require authToken in localStorage */}
        <Route element={<ProtectedRoute />}> 
          <Route exact path="/payment" element={<PaymentPage />} />
          <Route exact path="/additional-payment" element={<AdditionalPaymentPage />} />
          <Route exact path="/with-drawth-payment" element={<WithDrawthPaymentPage />} />

          <Route exact path="/new-post" element={<NewPostPage />} />
          <Route exact path="/new-good-post" element={<NewGoodPostPage />} />
          <Route exact path="/new-freelancer-post" element={<NewFreelancerPostPage />} />

         
          <Route exact path="/new-ai-live-post" element={<NewAiLivePostPage />} />
          <Route exact path="/admin-control" element={<AdminControlPage />} />
          <Route exact path="/reward-list" element={<RewardListPage />} />
        </Route>
      </Routes>
      
    </>
  )
}

export default App
