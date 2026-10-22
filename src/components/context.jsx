import { createContext, useState,useEffect, useReducer } from "react";
// Creamos el contexto utilizando createContext()
export const UserContext = createContext();
// Creamos el proveedor del contexto que nos permitirá
// compartir dicho contexto a los componentes hijos.

// Creamos una función para obtener los datos del storage
// y otra para almacenarlos
const getUserFromStorage = () => {
  const localData = localStorage.getItem("user");
  return localData ? JSON.parse(localData) : [];

};


const setUserInStorage = (user) =>
  localStorage.setItem("user", JSON.stringify(user));



// Creamos un reducer para manipular la información y

// almacenarla en el estado
export const githubUserReducer = (state, action) => {

  switch (action.type) {
    case "CHANGE_USER":
        //console.log(action.payload);
      const existingUser = state.username === action.payload.username;
      if (!existingUser) {
        
        const { name, avatar_url, html_url, login } = action.payload;
        const newUser = { name, avatar_url, html_url, username: login };
        setUserInStorage(newUser);
        return newUser;
      }
      return state;
    
    case "CLEAR_USER":
        //console.log(action.payload);
      {
        
        localStorage.clear("user");
        
      }
      return state;
    default:
      return state;
  }
};





const UserContextProvider = ({ children }) => {
    // Almacenamos la información del usuario para poder
  // compartirla a nuestros componentes. El valor inicial
  // es la información que obtenemos del localStorage
//   const [user, setUser] = useState(getUserFromStorage());
const [user, dispatch] = useReducer(githubUserReducer, {}, getUserFromStorage );



  // En caso de que cambie el usuario seleccionado
  // actualizamos la información que se encuentre en
  // el storage
  useEffect(() => {
    setUserInStorage(user);
  }, [user]);

// Creamos una función para actualizar el usuario
//   const changeUser = (user) => setUser(user);

const changeUser = (user) => dispatch({ type: "CHANGE_USER", payload: user });

  const clearUser = () => dispatch({ type: "CLEAR_USER"});
  return (
    <UserContext.Provider value={{ user, changeUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;