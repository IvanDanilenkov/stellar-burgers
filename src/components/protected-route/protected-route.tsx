import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  element: ReactElement;
  onlyUnAuth?: boolean; // true => маршрут только для НЕавторизованных
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  element,
  onlyUnAuth = false
}) => {
  const location = useLocation();

  const user = useSelector((state) => state.user.user);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);

  // 1)  показываем загрузку
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // 2) Роуты, доступные только НЕавторизованным
  // Если пользователь уже залогинен — отправляем его обратно
  if (onlyUnAuth) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/';
    return user ? <Navigate to={from} replace /> : element;
  }

  // 3) Приватные роуты: если не залогинен — на /login и запоминаем, откуда пришли
  return user ? (
    element
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};
