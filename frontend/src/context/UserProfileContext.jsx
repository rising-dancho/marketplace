import { createContext, useReducer, useContext } from 'react';

export const UserProfileContext = createContext();

const userProfileReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'UPDATE_PROFILE':
      return { ...state, userProfile: action.payload };
    default:
      return state;
  }
};

export const UserProfileContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userProfileReducer, { userProfile: null });

  return (
    <UserProfileContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfileContext = () => useContext(UserProfileContext);
