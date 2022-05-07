import './style.css';
import { useState } from 'react'
import api from '../../services/api'
import { getItem, setItem } from '../../utils/storage'
import CloseIcon from '../../assets/close.svg'

export default function ProfileCard({ perfil, setPerfil }) {
    const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmacaoSenha: '' });
    const token = getItem('token')

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

            const response = await api.put('/usuario', {
                nome: form.nome,
                email: form.email,
                senha: form.senha
            },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }

                })

            setItem('usuarioNome', form.nome)
            setPerfil(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='modal'>
            <form className='card_registros card_perfil' onSubmit={handleSubmit}>
                <h1>Editar perfil</h1>
                <img onClick={() => setPerfil(false)} src={CloseIcon} />

                <label for='nome'>Nome</label>
                <input type='text' id name='nome' value={form.nome} onChange={(e) => handleChangeForm(e)} />
                <label for='email'>E-mail</label>
                <input type='email' name='email' value={form.email} onChange={(e) => handleChangeForm(e)} />
                <label for='senha'>Senha</label>
                <input type='password' name='senha' value={form.senha} onChange={(e) => handleChangeForm(e)} />
                <label for='confirmacaoSenha'>Confirmação de Senha</label>
                <input type='password' name='confirmacaoSenha' value={form.confirmacaoSenha} onChange={(e) => handleChangeForm(e)} />

                <div className='botao_confirmar botao_confirmar_perfil'>
                    <button className='confirm'>Confirmar</button>
                </div>
            </form>
        </div>
    )
}