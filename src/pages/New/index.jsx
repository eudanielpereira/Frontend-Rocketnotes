import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { NoteItem } from '../../components/NoteItem';
import { Section } from '../../components/Section';
import { Button } from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';

import { api } from '../../services/api';

import { Container, Form } from './styles';

export function New(){
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] =useState(""); 

  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] =useState(""); 

  const navigate = useNavigate();

  function handleBack(){ // voltar para a home, função p o button voltar
    navigate(-1); // o -1 faz voltar para a rota anterior
  }

  function handleAddLink(){
    setLinks(prevState => [...prevState, newLink]); // o ...prevState faz com que o novo link seja adicionado ao outros e não substitua os antigos
    setNewLink(""); // reseta o estado que adiciona os links
  }

  function handleRemoveLink(deleted){
    setLinks(prevState => prevState.filter(link => link !== deleted)); // retorna uma lista com os links, menos com o que é para ser deletado
  }

  function handleAddTag(){
    setTags(prevState => [...prevState, newTag]);
    setNewTag("");
  }

  function handleRemoveTag(deleted){
    setTags(prevState => prevState.filter(tag => tag !== deleted)); // filtro traz todas as tags, menos a deletada
  }

  async function handleNewNote(){
    if(!title){ // verifica se a nota tem título
      return alert("Digite o título da nota")
    }

    if(newLink){ // verifica se o link digitado foi adicionado, clicando no +
      return alert("Você deixou um link no campo para adicionar, mas não adicionou. Clique em adicionar ou deixe o campo vazio")
    }

    if(newTag){ // verifica se a tag digitada foi adicionada, clicando no +
      return alert("Você deixou uma tag no campo para adicionar, mas não adicionou. Clique em adicionar ou deixe o campo vazio")
    }

    await api.post("/notes", {
      title,
      description,
      tags,
      links
    });

    alert("Nota criada com sucesso!");
    navigate(-1); // o -1 faz voltar para a rota anterior
  }

  return (
    <Container>
      <Header />

      <main>
        <Form>
          <header>
            <h1>Criar nota</h1>
            <ButtonText 
              title="Voltar" 
              onClick={handleBack}
            />
          </header>

          <Input 
            placeholder="Título" 
            onChange={e => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Observações" 
            onChange={e => setDescription(e.target.value)}

          />

          <Section title="Links úteis">
            {
              links.map((link, index) =>(
                <NoteItem     
                  key={String(index)}
                  value={link}
                  onClick={() => handleRemoveLink(link)} // funções com parâmetro *precisam* ser colocadas como Arrow Function
                />
              ))
            }
            <NoteItem 
            isNew 
            placeholder="Novo link"
            value={newLink}
            onChange={e=> setNewLink(e.target.value)}
            onClick={handleAddLink} />
          </Section>

          <Section title="Marcadores">
            <div className="tags">
              {
                tags.map((tag, index) => (
                  <NoteItem 
                  key={String(index)}
                  value={tag}
                  onClick={() => handleRemoveTag(tag)} 
                  />
                ))
              }
              <NoteItem 
                isNew 
                placeholder="Nova tag" 
                onChange={e => setNewTag(e.target.value)}
                value={newTag}
                onClick={handleAddTag}
              />
            </div>
          </Section>

          <Button 
            title="Salvar"
            onClick={handleNewNote}
          />
        </Form>
      </main>
    </Container>
  )
}