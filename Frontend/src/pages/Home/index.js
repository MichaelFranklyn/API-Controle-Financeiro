import './style.css'
import api from '../../services/api';
import { useEffect, useState } from 'react';
import { format, getDay } from 'date-fns'
import { getItem } from '../../utils/storage';
import Header from '../../Components/Header'
import ProfileCard from '../../Components/ProfileCard'
import EditCard from '../../Components/EditCard';
import Categories from '../../Components/Categories';
import Filtro from '../../assets/filtro.svg'
import Caneta from '../../assets/caneta.svg'
import Lixeira from '../../assets/lixeira.svg'
import setaData from '../../assets/setaData.svg'

export default function Home() {
    const token = getItem('token')
    const [transactions, setTransactions] = useState([]);
    const [saldo, setSaldo] = useState([]);
    const [filter, setFilter] = useState(false);
    const [days, setDays] = useState(['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']);
    const [showNew, setShowNew] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [perfil, setPerfil] = useState(false);
    const [modalDelete, setModalDelete] = useState(false)
    const [idTransaction, setIdTransaction] = useState('');

    useEffect(() => {
        loadTransactions()
    }, [])

    async function loadTransactions() {
        try {
            const response = await api.get('/transacao', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });

            setTransactions(response.data);
        } catch (error) {
            console.log(error)
        }

        try {
            const response = await api.get('/transacao/extrato', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });

            setSaldo(response.data);
        } catch (error) {
            console.log(error)
        }
    }

    async function handleDeleteTransaction(id) {
        try {
            const deleteTransaction = api.delete(`transacao/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            })

            const response = await api.get('/transacao', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });

            setTransactions(response.data);
            loadTransactions();
        } catch (error) {
            console.log(error)
        }
    }

    function handleEditTransaction(id) {
        setShowEdit(true)
        setIdTransaction(id)
    }

    return (
        <div className='conteudo_home'>
            <Header
                perfil={perfil}
                setPerfil={setPerfil}
            />

            <div className='conteudo_main'>
                <div className='ladoEsquerdo'>

                    <div className='filter'>
                        <button className='botao_filtrar' onClick={() => setFilter(!filter)}><img src={Filtro} /> Filtrar</button>
                    </div>

                    {filter &&
                        <Categories
                            setTransactions={setTransactions}
                            loadTransactions={loadTransactions}
                        />
                    }

                    <div className='transacoes'>
                        <div className='header_transacoes'>
                            <div className='dataHeader'>
                                <h3>Data</h3>
                                <img src={setaData}/>
                            </div>
                            <h4>Dia da semana</h4>
                            <h4>Descrição</h4>
                            <h4>Categoria</h4>
                            <h4>Valor</h4>
                            <div className='divNeutra'></div>
                        </div>
                        <div className='relative'>
                            {transactions.map((transaction) => (
                                <div key={transaction.id} className='lista_transacoes'>
                                    <h4>{format(new Date(transaction.data), "dd/MM/yyyy")}</h4>
                                    <h5>{days[getDay(Date.parse(transaction.data))]}</h5>
                                    <h5>{transaction.descricao}</h5>
                                    <h5>{transaction.categoria_nome}</h5>
                                    <h5 className='valor'>{`R$ ${(transaction.valor / 100).toFixed(2)}`}</h5>
                                    <div className='icons'>
                                        <img onClick={() => handleEditTransaction(transaction.id)} src={Caneta} />
                                        <img className='lixeira' onClick={() => setModalDelete(true)} src={Lixeira} />
                                        {modalDelete &&
                                            <div key={transaction.id} className='excluir-transacao'>
                                                <span>Apagar item?</span>
                                                <div className='btn_apagar'>
                                                    <button className='botaoPositivo' onClick={() => handleDeleteTransaction(transaction.id)} >Sim</button>
                                                    <button className='botaoNegativo' onClick={() => setModalDelete(false)}>Não</button>
                                                </div>

                                            </div>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='resumo'>
                    <div className='card'>
                        <h1>Resumo</h1>
                        <div className='situacao'>
                            <div className='condicao'>
                                <h3>Entrada</h3>
                                <h3>Saída</h3>
                            </div>
                            <div className='valores'>
                                <h3 className='valor_entrada'>{saldo.entrada ? `R$ ${(saldo.entrada / 100).toFixed(2)}` : "R$ 0,00"}</h3>
                                <h3 className='valor_saida'>{saldo.saida ? `R$ ${(saldo.saida / 100).toFixed(2)}` : "R$ 0,00"}</h3>
                            </div>
                        </div>
                        <div className='resultado'>
                            <div className='condicao'>
                                <h3 className='condicao_saldo'>Saldo</h3>
                            </div>
                            <div className='valores'>
                                <h3 className='valor_saldo'>{`R$${((saldo.entrada - saldo.saida) / 100).toFixed(2)}`}</h3>
                            </div>
                        </div>
                    </div>
                    <div className='btn-register'>
                        <button onClick={() => setShowNew(!showNew)}>Adicionar Registro</button>
                    </div>
                </div>
            </div>
            {showNew &&
                <EditCard
                    showNew={showNew}
                    setShowNew={setShowNew}
                    showEdit={showEdit}
                    setShowEdit={setShowEdit}
                    loadTransactions={loadTransactions}
                />
            }
            {showEdit &&
                <EditCard
                    showNew={showNew}
                    setShowNew={setShowNew}
                    showEdit={showEdit}
                    setShowEdit={setShowEdit}
                    loadTransactions={loadTransactions}
                    idTransaction={idTransaction}
                    setIdTransaction={setIdTransaction}
                />
            }
            {perfil &&
                <ProfileCard
                    perfil={perfil}
                    setPerfil={setPerfil}
                />}

        </div>
    )
}