import { User } from './types';

export const saveUser = (user: User): void => {
  localStorage.setItem('CuraSyn+_user', JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem('CuraSyn+_user');
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem('CuraSyn+_user');
};

export const isAuthenticated = () => {
  return !!getUser();
};