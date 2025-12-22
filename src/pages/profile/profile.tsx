import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import { ProfileUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== (user?.name ?? '') ||
    formValue.email !== (user?.email ?? '') ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const dataToSend: { name?: string; email?: string; password?: string } = {
      name: formValue.name,
      email: formValue.email
    };

    if (formValue.password) {
      dataToSend.password = formValue.password;
    }

    dispatch(updateUser(dataToSend))
      .unwrap()
      .then(() => {
        // После успешного сохранения очищаем пароль в форме
        setFormValue((prev) => ({ ...prev, password: '' }));
      })
      .catch(() => {});
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();

    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
