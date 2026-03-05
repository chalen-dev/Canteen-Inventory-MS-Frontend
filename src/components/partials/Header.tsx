import {APP_NAME} from "../../config/constants.ts";
import {useTheme} from "../../contexts/ThemeContext.tsx";


type HeaderProps = {} & React.HTMLAttributes<HTMLElement>

export function Header({...rest}: HeaderProps){
    const { theme, toggleTheme } = useTheme();

    return (
      <header {...rest}>
          <h1>{APP_NAME}</h1>
          <button onClick={toggleTheme} className="theme-toggle">
              {theme === 'light' ? '🌙' : '☀️'}
          </button>
      </header>
    );
}

