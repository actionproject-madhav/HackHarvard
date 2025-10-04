export const saveUser = (user) => {
  localStorage.setItem('claritymd_user', JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem('claritymd_user');
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem('claritymd_user');
};

export const isAuthenticated = () => {
  return !!getUser();
};