import { Container } from './styles';

export function Input({ icon: Icon, ...rest }){
  return(
    <Container>
      {Icon && <Icon size={20} />}
      <input {...rest} />
    </Container>
  )
};

// {Icon && <Icon />} -> se o ícone existe, ele será mostrado.