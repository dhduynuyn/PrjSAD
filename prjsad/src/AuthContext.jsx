import React, { createContext, useState, useContext, useEffect, useMemo } from 'react'; // Added useMemo for optimization

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error("Failed to parse stored user:", error);
            localStorage.removeItem('authUser');
            localStorage.removeItem('authToken');
            setToken(null);
            setUser(null);
          }
        } else {
          try {
            const response = await fetch('/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${storedToken}`,
              },
            });
            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
              localStorage.setItem('authUser', JSON.stringify(userData));
            } else {
              console.warn("Token invalid or expired during initialization.");
              localStorage.removeItem('authToken');
              localStorage.removeItem('authUser');
              setToken(null);
              setUser(null);
            }
          } catch (error) {
            console.error("Error fetching user on init:", error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setToken(null);
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userDataFromApi, authTokenFromApi) => {
    const userWithStories = { ...userDataFromApi, stories: userDataFromApi.stories || [] };
    localStorage.setItem('authToken', authTokenFromApi);
    localStorage.setItem('authUser', JSON.stringify(userWithStories)); // Use the prepared user object
    setToken(authTokenFromApi);
    setUser(userWithStories);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('authUser', JSON.stringify(updatedUserData));
  };

  const addStoryToUser = (newStory) => {
    setUser(currentUser => {
      if (!currentUser) return null;

      const updatedUser = {
        ...currentUser,
        stories: [newStory, ...(currentUser.stories || [])]
      };

      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      
      console.log('AuthContext: User updated with new story.', updatedUser);
      return updatedUser;
    });
  };

  // ======================================================================
  // FIX IS HERE: Add `addStoryToUser` to the context value object
  // ======================================================================
  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    updateUser,
    addStoryToUser, // <-- THIS LINE IS THE FIX
    isLoadingAuth: isLoading,
  }), [user, token, isLoading]); // useMemo prevents re-renders of consumers when unrelated state changes

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};