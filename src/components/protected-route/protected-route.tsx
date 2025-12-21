import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  element: ReactElement;
  onlyUnAuth?: boolean; // если true — маршрут только для НЕавторизованных
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  element,
  onlyUnAuth
}) => {
  const location = useLocation();

  const user = useSelector((state) => state.user.user);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);

  // Пока не проверили авторизацию — ничего не рендерим
  if (!isAuthChecked) return null;

  // Маршрут только для НЕавторизованных (login/register/forgot/reset)
  if (onlyUnAuth) {
    return user ? <Navigate to='/' replace /> : element;
  }

  // Защищённый маршрут (profile/orders и т.п.)
  return user ? (
    element
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};
