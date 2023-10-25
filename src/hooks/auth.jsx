import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api"

export const AuthContext = createContext({});

function AuthProvider({ children }){
  const [data, setData] = useState({});
  
  async function signIn({ email, password }){

    try {
      const response = await api.post("/sessions", { email, password });
      const { user, token } = response.data;

      localStorage.setItem("@rocketnotes:user", JSON.stringify(user)); //o stringify é uma propriedade do JSON que transforma em string
      localStorage.setItem("@rocketnotes:token", token); //o token não precisa do stringify pq já é uma string
      // é interessante colocar o @NomeDaAplicação:... (@rocketnotes) para identificar a aplicação no localStorage

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // insere um token de autorização em todas as requisições que o usuário vai fazer
      setData({ user, token });

    } catch (error) {
      if(error.response){ // se o erro tiver uma resposta no back-end...
        alert(error.response.data.message) // ...será lida no alert a mensagem escrita no back-end.
      } else{ // caso o erro não tenha resposta...
        alert("Não foi possível entrar.") //...será lida uma mensagem genérica
      }
    } 
  }

  function signOut(){ // fazer logout
    const token = localStorage.removeItem("@rocketnotes:token");
    const user = localStorage.removeItem("@rocketnotes:user");

    setData({});
  }

  async function updateProfile({ user, avatarFile }){
    try {

      if(avatarFile){
        const fileUploadForm = new FormData();
        fileUploadForm.append("avatar", avatarFile);

        const response = await api.patch("/users/avatar", fileUploadForm);
        user.avatar = response.data.avatar;
      }

      await api.put("/users", user);
      localStorage.setItem("@rocketnotes:user", JSON.stringify(user));

      setData({ user, token: data.token });
      alert("Perfil atualizado");

    } catch (error) {
      if(error.response){ // se o erro tiver uma resposta no back-end...
        alert(error.response.data.message) // ...será lida no alert a mensagem escrita no back-end.
      } else{ // caso o erro não tenha resposta...
        alert("Não foi possível atualizar o perfil.") //...será lida uma mensagem genérica
      }
    } 
  }

  useEffect(() => { // recupera informações de user e token Local Storage, com isso não fará logout quando a página for recarregada
    const token = localStorage.getItem("@rocketnotes:token");
    const user = localStorage.getItem("@rocketnotes:user");

    if(token && user) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setData({
        token,
        user: JSON.parse(user) // volta os dados do user armazenados como string para JSON
      })
    }
  }, []); // [ ] está vazio pois não precisamos definir um estado dependente

  return(
    <AuthContext.Provider value={{ 
    signIn, 
    signOut,
    updateProfile,
    user: data.user
    }}>
      {children}
    </AuthContext.Provider>
  )
};

function useAuth(){
  const context = useContext(AuthContext)

  return context;
}

export { AuthProvider, useAuth };