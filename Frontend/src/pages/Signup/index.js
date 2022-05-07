import './style.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Header from '../../Components/Header'

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmacaoSenha: '' });

    function handleChangeForm(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (!form.nome || !form.email || !form.senha || !form.confirmacaoSenha) {
                return;
            }

            if (form.senha !== form.confirmacaoSenha) {
                return;
            }

            const response = await api.post('/usuarios', {
                nome: form.nome,
                email: form.email,
                senha: form.senha
            })
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='conteudo_geral_signup'>
            <Header />
            <div className='form_site form_cadastro'>
                <form onSubmit={handleSubmit}>
                    <h3>Cadastre-se</h3>
                    <label for='nome'>Nome</label>
                    <input type='text' id name='nome' value={form.nome} onChange={(e) => handleChangeForm(e)} />
                    <label for='email'>E-mail</label>
                    <input type='email' name='email' value={form.email} onChange={(e) => handleChangeForm(e)} />
                    <label for='senha'>Senha</label>
                    <input type='password' name='senha' value={form.senha} onChange={(e) => handleChangeForm(e)} />
                    <label for='confirmacaoSenha'>Confirmação de Senha</label>
                    <input type='password' name='confirmacaoSenha' value={form.confirmacaoSenha} onChange={(e) => handleChangeForm(e)} />
                    <button>Cadastrar</button>
                </form>
                <h4>Já tem cadastro? <a onClick={() => navigate('/')} >Clique aqui!</a></h4>
            </div>
        </div>
    );
}