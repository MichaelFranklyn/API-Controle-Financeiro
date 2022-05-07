import './style.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setItem, getItem } from '../../utils/storage';
import api from '../../services/api';
import Header from '../../Components/Header';
    
export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const token = getItem('token');

    useEffect(() => {
        if (token) {
            navigate('/home');
        }
    }, []);

    async function handleSubmitLogin(e) {
        e.preventDefault();

        try {
            if (!email || !senha) {
                return
            }

            const response = await api.post('/login', {
                email,
                senha
            })

            if (response.status > 204) {
                return
            }

            const { token, usuario } = response.data;
            setItem('token', token);
            setItem('usuarioId', usuario.id);
            setItem('usuarioNome', usuario.nome);
            navigate('/home');
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='conteudo_geral conteudo_geral_login'>
            <Header />
            <div className='conteudo_form conteudo_login'>

                <div className='conteudo_texto'>
                    <h1>Controle suas <span>finanças</span>, <br></br> sem planilha chata.</h1>
                    <p>Organizar as suas finanças nunca foi tão fácil,<br></br> com o DINDIN, você tem tudo num único lugar<br></br> e em um clique de distância.</p>
                    <button onClick={() => navigate('/Signup')}>Cadastre-se</button>
                </div>

                <div className='form_site form_login'>
                    <form onSubmit={handleSubmitLogin}>
                        <h3>Login</h3>
                        <label htmlFor='email'>E-mail</label>
                        <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor='senha'>Senha</label>
                        <input type='password' name='senha' value={senha} onChange={(e) => setSenha(e.target.value)} />
                        <button>Entrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}