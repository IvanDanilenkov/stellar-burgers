import { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  type Location,
  useNavigate
} from 'react-router-dom';

import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  Modal,
  OrderInfo,
  IngredientDetails,
  ProtectedRoute
} from '@components';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchUser } from '../../services/slices/userSlice';

type LocationState = { background?: Location };

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const state = location.state as LocationState | null;
  const background = state?.background;

  const handleModalClose = () => {
    navigate(-1);
  };

  // 1) Загружаем ингредиенты
  // 2) Проверяем авторизацию (если токены есть — user заполнится)
  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основные страницы (если есть background — показываем "фон" под модалкой) */}
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Роуты только для НЕавторизованных */}
        <Route
          path='/login'
          element={<ProtectedRoute onlyUnAuth element={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute onlyUnAuth element={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute onlyUnAuth element={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute onlyUnAuth element={<ResetPassword />} />}
        />

        {/* Защищённые роуты */}
        <Route
          path='/profile'
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute element={<ProfileOrders />} />}
        />

        {/* Страницы при прямом переходе (без background) */}
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRoute element={<OrderInfo />} />}
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модалки: показываем только если переход был "изнутри" приложения (есть background) */}
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute
                element={
                  <Modal title='' onClose={handleModalClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
