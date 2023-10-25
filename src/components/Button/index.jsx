import { Container } from "./styles";

export function Button({ title, loading = false, ...rest }){ // o ...rest diz que qualquer propriedade que não esteja na {}, mas tenha sido informada no index da aplicação, será lida
// o ...rest é muito utilizado quando tem muitas propriedades e não quer deixar todas explicitas

    return(
    <Container 
    type="button"
    disabled={loading}
    {...rest}
    >
        { loading ? 'Carregando...' : title}
    </Container>
    ); // se não colocar as propriedades entre {}, vai aparecer o nome da propriedade
}