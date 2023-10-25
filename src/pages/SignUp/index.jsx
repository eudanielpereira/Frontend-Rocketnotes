import { useState } from "react"; // estado para salvar as informações digitadas
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate para redirecionar o usuário a agina de login após o cadastro

import { api } from "../../services/api";

import {  Input } from "../../components/Input";
import {  Button } from "../../components/Button";

import { Container, Form, Background } from "./styles";

export function SignUp(){
  const [name, setName] = useState(""); // estado para salvar as informações digitadas. entre () é o valor inicial do estado
  const [email, setEmail] = useState(""); // entre [nome do estado, nome da função que vai atualizar o estado] o set é colocado na frente do nome da função
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // para redirecionar o usuário a página de login após o cadastro

  function handleSignUp(){
    if(!name || !email || !password) {
     return alert("Preencha todos os campos!");
    }

    api.post("/users", { name, email, password })
    .then(() => {
      alert("Usuário cadastrado com sucesso!");
      navigate("/"); // para redirecionar o usuário a agina de login após o cadastro
    }) // caso dê certo
    .catch(error => {
      if(error.response){
        alert(error.response.data.message); // pega a mensagem de erro definida no back-end
      }else{
        alert("Não foi possível cadastrar.");
      }
    }) // caso tenha algum problema
  }
  
  return (
    <Container>
      <Background />

      <Form>
        <h1>Rocket Notes</h1>
        <p>Aplicação para gerenciar e salvar seus links úteis</p>
        
        <h2>Crie sua conta</h2>

        <Input 
          placeholder="Nome"
          type="text"
          icon={FiUser}
          onChange={e => setName(e.target.value)} // função para disparar evento quando o valor mudar e capturá-lo
        />

        <Input 
          placeholder="E-mail"
          type="text"
          icon={FiMail}
          onChange={e => setEmail(e.target.value)} // função para disparar evento quando o valor mudar e capturá-lo

        />

        <Input 
          placeholder="Senha"
          type="password"
          icon={FiLock}
          onChange={e => setPassword(e.target.value)} // função para disparar evento quando o valor mudar e capturá-lo
        />

        <Button title="Cadastrar" onClick={handleSignUp} />  

        <Link to="/">Voltar para o login</Link>    

      </Form>
    </Container>    
  );
}