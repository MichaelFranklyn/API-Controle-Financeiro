import './style.css'
import { useState, useEffect } from 'react'
import { getItem, clear } from '../../utils/storage'
import { useNavigate } from 'react-router-dom';
import Dindin from '../../assets/dindin.svg'
import Profile from '../../assets/profile.svg'
import Logout from '../../assets/logout.svg'

export default function Header({ perfil, setPerfil }) {
    const [ativar, setAtivar] = useState(false);
    const navigate = useNavigate();
    const nome = getItem('usuarioNome');
    const token = getItem('token');

    useEffect(() => {
        if (token) {
            setAtivar(true)
        }
    }, [])

    async function handleLogout() {
        clear();
        setAtivar(false);
        navigate('/');
    }

    return (
        <header>
            <div className='logo_imagem'>
                <img src={Dindin} />
            </div>

            {ativar && <nav>
                <img onClick={() => setPerfil(true)} className='perfilImg' src={Profile} />
                <h1>{nome}</h1>
                <img className='logoutImg' src={Logout} onClick={() => handleLogout()} />
            </nav>}
        </header>
    )
}