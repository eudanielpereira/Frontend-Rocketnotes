import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

import { api } from '../../services/api';

import { Container, Brand, Menu, Search, Content, NewNote } from './styles';

import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Section } from '../../components/Section';
import { Note } from '../../components/Note';
import { ButtonText } from '../../components/ButtonText';

export function Home() {
	const [tags, setTags] = useState([]);
	const [tagsSelected, setTagsSelected] = useState([]);
	const [search, setSearch] = useState("");
	const [notes, setNotes] = useState([]);

	const navigate = useNavigate();

	function handleTagSelected(tagName){ // faz desselecionar as tags quando clica no todos
		if(tagName === "all"){
			return setTagsSelected([]);
		}

		const alreadySelected = tagsSelected.includes(tagName);
		
		if(alreadySelected){ // tira a seleção das tags
			const filteredTags = tagsSelected.filter(tag => tag !== tagName);
			setTagsSelected(filteredTags)
		} else { // seleciona as tags
			setTagsSelected(prevState => [...prevState, tagName]); // o prevState permite selecionar mais de uma tag
		}
	}

	function handleDetails(id){
		navigate(`/details/${id}`);
	}

	useEffect(() => {
		async function fetchTags() { // pega todas as tags criadas para aparecer na home. Essa função pode ser criada no useEffect porque ela não será usada em mais nenhum lugar
			const response = await api.get("/tags");
			setTags(response.data);
		}

		fetchTags();
	},[])

	useEffect(() => {
		async function fetchNotes(){
			const response = await api.get(`/notes?title=${search}&tags=${tagsSelected}`);
			setNotes(response.data);
		}

		fetchNotes();
	},[tagsSelected, search])

	return (
		<Container>
			<Brand>
				<h1>Rocketnotes</h1>
			</Brand>

			<Header />

			<Menu>
				<li>
					<ButtonText 
						title="Todos" 
						$isactive={tagsSelected.length === 0} // verifica se o array do tagsSelected está vazio, caso esteja significa que não há nanhuma tag selecionada, então o Todos deve estar destacado
						onClick={() => handleTagSelected("all")}
					/>
				</li>
				{
					tags && tags.map(tag => (
						<li key={String(tag.id)}>
							<ButtonText 
								title={tag.name} 
								onClick={() => handleTagSelected(tag.name)}
								$isactive={tagsSelected.includes(tag.name)}
							/>
						</li>
					))
				}
			</Menu>

			<Search>
				<Input 
					placeholder="Pesquisar pelo título"
					onChange={(e) =>setSearch(e.target.value)}
				/>
			</Search>

			<Content>
				<Section title="Minhas notas">
					{
						notes.map(note => (
							<Note 
								key={String(note.id)}
								data={note}
								onClick={() => handleDetails(note.id)}
							/>
						))
					}

				</Section>
			</Content>

			<NewNote to="/new">
				<FiPlus/>
				Criar nota
			</NewNote>

		</Container>
	)
}