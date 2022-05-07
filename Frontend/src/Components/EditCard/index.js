import './style.css';
import { useState, useEffect } from 'react'
import api from '../../services/api';
import { getItem } from '../../utils/storage';
import CloseIcon from '../../assets/close.svg'
import setaCategorias from '../../assets/setaCategorias.svg'

export default function EditCard({ showNew, setShowNew, showEdit, setShowEdit, loadTransactions, idTransaction }) {
    const token = getItem('token')
    const [tipo, setTipo] = useState('entrada');
    const [valor, setValor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [data, setData] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategoriesOptions()
    }, [])

    function handleCloseModal() {
        setShowEdit(false)
        setShowNew(false)
    }

    async function handleSubmit(e, id) {
        e.preventDefault();

        try {
            if (showNew) {
                const response = await api.post('/transacao', {
                    descricao,
                    valor,
                    data,
                    categoria_id: categoria,
                    tipo
                },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }

                    });

                loadTransactions();
            }

            if (showEdit) {
                const response = await api.put(`/transacao/${idTransaction}`, {
                    descricao,
                    valor,
                    data,
                    categoria_id: categoria,
                    tipo
                },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }

                    });

                loadTransactions();
            }

            setShowNew(false)
            setShowEdit(false)
        } catch (error) {
            console.log(error)
        }
    }

    async function loadCategoriesOptions() {
        try {
            const token = getItem('token')

            const response = await api.get('/categoria', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });

            setCategories(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='modal'>
            <form className='card_registros card_editarOuAdicionar' onSubmit={handleSubmit}>
                <h1>{showEdit ? 'Editar Registro' : 'Adicionar Registro'}</h1>
                <img onClick={() => handleCloseModal()} src={CloseIcon} />

                <div className='btns'>
                    <button type='button' className={tipo === 'entrada' ? 'botao_entrada' : 'botao_limpo_entrada' } onClick={() => setTipo('entrada')}>Entrada</button>
                    <button type='button' className={tipo === 'saida' ? 'botao_saida' : 'botao_limpo_saida' } onClick={() => setTipo('saida')}>Saída</button>
                </div>

                <label>Valor</label>
                <input type='number' name='valor' value={valor} onChange={(e) => setValor(e.target.value)} />
                <label>Categorias</label>
                <select onChange={(e) => setCategoria(e.target.value)}>
                    {categories.map((categorie) => (
                        <option key={categorie.id} value={categorie.id}>{categorie.descricao}</option>
                    ))}
                </select>
                <label>Data</label>
                <input type='text' name='data' value={data} onChange={(e) => setData(e.target.value)} />
                <label>Descrição</label>
                <input type='text' name='descricao' value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                <div className='botao_confirmar botao_confirmar_editOuAdicionar'>
                    <button type='submit' className='confirm'>Confirmar</button>
                </div>

                <div className='setaCategorias'>
                    <img src={setaCategorias} />
                </div>
            </form>
        </div>
    )
}