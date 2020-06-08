import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet'
import axios from 'axios';
import api from '../../services/api';

import './styles.css'
import logo from '../../assets/logo.svg'

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGE {
    sigla: string;
}

interface IBGECity {
    nome: string;
}

const CreatePoint = () => {

    const [itens, setItens ] = useState<Item[]>([]);
    const [ufs, setUfs ] = useState<string[]>([]);
    const [cidades, setCidades ] = useState<string[]>([]);
    const [selectedUf, setSelectedUf ] = useState<string>('0');
    const [selectedCidade, setSelectedCidades ] = useState<string>('0');

    useEffect(() => {
        api.get('itens').then(response => {
            setItens(response.data);
        })
        axios.get<IBGE[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        })
    }, []);

    useEffect(() => {
        if(selectedUf === '0') {
            return;
        }
        axios.get<IBGECity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cidadesNome = response.data.map(cidade => cidade.nome);

            setCidades(cidadesNome);
        })
    }, [selectedUf]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUf(event.target.value);
    }
    function handleSelectCidade(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCidades(event.target.value);
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                    <Link to="/">
                        <FiArrowLeft/>
                        Voltar para home
                    </Link>
            </header>

            <form>
                <h1>Cadastro do<br/>ponto de coleta</h1>

                <fieldset>
                  <legend>
                      <h2>Dados</h2>
                  </legend>

                  <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text"
                            name="name"
                            id="name"
                        />
                  </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={[-25.116167, -50.1511143 ]} zoom={15}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[-25.116167, -50.1511143 ]}/>
                    </Map>
                        
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="cidade">Cidade</label>
                            <select name="cidade" id="cidade" value={selectedCidade} onChange={handleSelectCidade}>
                                <option value="0">Selecione uma cidade</option>
                                {cidades.map(cidade => (
                                    <option key={cidade} value={cidade}>{cidade}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {itens.map(item =>
                            <li key={item.id} className="selected">
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li> 
                        )}
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    );
}

export default CreatePoint;
