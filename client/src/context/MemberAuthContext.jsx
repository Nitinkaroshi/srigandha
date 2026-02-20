import { createContext, useState, useContext, useCallback } from 'react';
import { memberAuthAPI } from '../utils/api';

const MemberAuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useMemberAuth = () => {
  const context = useContext(MemberAuthContext);
  if (!context) {
    throw new Error('useMemberAuth must be used within MemberAuthProvider');
  }
  return context;
};

const getInitialMember = () => {
  try {
    const token = localStorage.getItem('memberToken');
    const savedMember = localStorage.getItem('member');
    if (token && savedMember) {
      return JSON.parse(savedMember);
    }
  } catch {
    // ignore
  }
  return null;
};

export const MemberAuthProvider = ({ children }) => {
  const [member, setMember] = useState(getInitialMember);
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = async (googleCredential) => {
    setLoading(true);
    try {
      const response = await memberAuthAPI.googleAuth(googleCredential);
      const { token, ...memberData } = response.data;

      localStorage.setItem('memberToken', token);
      localStorage.setItem('member', JSON.stringify(memberData));
      setMember(memberData);

      return { success: true, member: memberData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Google sign-in failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('memberToken');
    localStorage.removeItem('member');
    setMember(null);
  };

  const refreshProfile = useCallback(async () => {
    try {
      const response = await memberAuthAPI.getProfile();
      const memberData = response.data;
      localStorage.setItem('member', JSON.stringify(memberData));
      setMember(memberData);
      return memberData;
    } catch {
      // Token might be expired
      logout();
      return null;
    }
  }, []);

  const value = {
    member,
    loading,
    loginWithGoogle,
    logout,
    refreshProfile,
    isMemberAuthenticated: !!member,
    isActiveMember: member?.status === 'active',
    isGuestMember: member?.status === 'guest',
  };

  return <MemberAuthContext.Provider value={value}>{children}</MemberAuthContext.Provider>;
};
