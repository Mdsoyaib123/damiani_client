// src/hooks/useAuth.ts
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

export const useAuth = () => {
    const { token, user } = useSelector((state: RootState) => state.auth);

    const isLoggedIn = !!token && !!user?.userId;

    // Optional extras you might use later
    const userId = user?.userId;
    const role = user?.role;
    const isAdmin = role === 'admin';   // if you have roles

    return {
        isLoggedIn,
        user,
        userId,
        role,
        isAdmin,
    };
};