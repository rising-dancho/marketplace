import { UserProfileContext } from '../context/UserProfileContext'; // the actual context
import { useContext } from 'react'; // we will use this to consume the context

export const useUserProfileContext = () => {
  const context = useContext(UserProfileContext);

  // if check to make sure context is not returning null
  if (!context) {
    throw Error('useUserProfileContext must be used inside a UserProfileContextProvider It currently has no value');
  }
  return context;
};
