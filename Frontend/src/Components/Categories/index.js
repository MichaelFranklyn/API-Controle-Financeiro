import './style.css'
import { getItem } from '../../utils/storage'
import { useState, useEffect} from 'react'
import api from '../../services/api'
import Soma from '../../assets/soma.svg'

export default function Categories({ setTransactions, loadTransactions }) {
    const token = getItem('token')
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        loadCategories();
    }, [])

    async function loadCategories() {
        try {
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

    async function handleFilterCategories(e) {
        try {
            if (selectedCategories.length) {
                let requisicao = ''
                for (let item of selectedCategories) {
                    if (item[selectedCategories.lenght - 1]) {
                        requisicao += `filtro[]=${item}`
                        break
                    }
                    requisicao += `filtro[]=${item}&`
                }
                
                const response = await api.get(`/transacao?${requisicao}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });

                setTransactions(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleClearFilter() {
        setSelectedCategories([]);
        loadCategories();
        loadTransactions();
    }

    async function handleSelectedCategories(e) {
        setSelectedCategories([...selectedCategories, e.target.value]);

        e.target.style.background = '#7978D9';
        e.target.style.color = '#FFFFFF';
    }
    
    return (
        <div className='categorias'>
            <h2>Categoria</h2>
            <div className='categoria'>
                {categories.map((categorie) => (
                    <div key={categorie.id} className='btn_categorias'>
                        <button value={categorie.descricao} onClick={(e) => handleSelectedCategories(e)} >{categorie.descricao} <img src={Soma} /></button>
                    </div>
                ))}
            </div>

            <div className='filtro_categorias'>
                <button onClick={() => handleFilterCategories()}>Aplicar Filtros</button>
                <button onClick={() => handleClearFilter()}>Limpar Filtros</button>
            </div>
        </div>
    )
}