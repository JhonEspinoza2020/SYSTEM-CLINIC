import { saveSession, getSession, clearSession, hasRole } from './hooks/useAuth';

beforeEach(() => {
  clearSession();
});

test('guarda y recupera sesión con token', () => {
  saveSession('token-test', { id: '1', nombreCompleto: 'Admin', rol: 'ADMIN' });
  expect(localStorage.getItem('authToken')).toBe('token-test');
  expect(getSession().rol).toBe('ADMIN');
  expect(hasRole('ADMIN')).toBe(true);
});

test('clearSession elimina datos', () => {
  saveSession('x', { rol: 'DOCTOR' });
  clearSession();
  expect(getSession()).toBeNull();
  expect(localStorage.getItem('authToken')).toBeNull();
});
