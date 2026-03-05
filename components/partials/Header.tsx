

type HeaderProps = {} & React.HTMLAttributes<HTMLElement>

export function Header({...rest}: HeaderProps){
    return (
      <header {...rest}>
      </header>
    );
}