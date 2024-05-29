import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function Busca() {
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState(false);
    const [edicao, setEdicao] = useState(false);
    const [clientId, setClientId] = useState(0);
    const [clientName, setName] = useState();
    const [clientEmail, setEmail] = useState();
    const [clientGenere, setGenero] = useState();
    const [deleteResposta, setResposta] = useState(false);

    async function getClientes() {
        await fetch('http://10.139.75.38:5251/GetAllClients', {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(json => setClientes(json))
            .catch(err => setError(true))
    }


    async function getClientes(id) {
        await fetch('http://10.139.75.38:5251/GetClientId/' + id, {
            method: 'GET',
            headers: {
                'Content-type': 'aplication/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then(json => {
                setClientId(json.clientId);
                setName(json.clientName);
                setEmail(json.clientEmail);
                setGenero(json.clientGenere);
            });
    }
    async function editClient() {
        await fetch('http://10.139.75.38:5251/UpdateClients/' + clientId, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                clientId: clientId,
                clientEmail: clientEmail,
                clientGenere: clientGenere,
                ClientName: clientName
            })
        })
            .then((response) => response.json())
            .catch(err => console.log(err));
        getClientes();
        setEdicao(false);
    }

    function showAlert(id, clientName) {
        Alert.alert(
            '',
            'Deseja realmente excluir esse cliente?',
            [
                { text: 'Sim', onPress: () => deleteCliente(id, clientName) },
                { text: 'Não', onPress: () => ('') },
            ],
            { cancelable: false }
        );
    }

    async function deleteCliente(id, clientName) {
        await fetch('http://10.139.75.38:5251/DeleteClients/' + id, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(res => res.json())
            .then(json => setResposta(json))
            .catch(err => setError(true))

        if (deleteResposta == true) {
            Alert.alert(
                '',
                'Usuário' + clientName + 'excluido com sucesso',
                [
                    { text: '', onPress: () => ('') },
                    { text: 'Ok', onPress: () => ('') },
                ],
                { cancelable: false }
            );
            getClientes();
        }
        else {
            Alert.alert(
                '',
                'Cliente' + clientName + 'não foi excluido.',
                [
                    { text: '', onPress: () => ('') },
                    { text: 'Ok', onPress: () => ('') },
                ],
                { cancelable: false }
            );
            getClientes();
        }
    }

    useEffect(() => {
        getClientes();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getClientes();
        }, [])
    );

    return (
        <View style={css.tudo}>
            <View style={css.container}>
                {edicao == false ?
                    <FlatList
                        style={css.flat}
                        data={clientes}
                        keyExtractor={(item) => item.clientId}
                        renderItem={({ item }) => (
                            <View style={css.itemContainer}>
                                <Text style={css.text}>
                                    {item.clientName}
                                </Text>
                                <TouchableOpacity style={css.btnEdit} onPress={() => { setEdicao(true); getClientes(item.clientId) }}>
                                    <Text style={css.btnText}>EDITAR</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={css.btnDelete} onPress={() => showAlert(item.clientId, item.clientName)}>
                                    <Text style={css.btnText}>EXCLUIR</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    :
                    <View style={css.editar}>
                        <TextInput
                            inputMode="text"
                            style={css.input}
                            value={clientName}
                            onChangeText={(digitado) => setName(digitado)}
                            placeholderTextColor="black"
                            placeholder='Nome'
                        />
                        <TextInput
                            inputMode="email"
                            style={css.input}
                            value={clientEmail}
                            onChangeText={(digitado) => setEmail(digitado)}
                            placeholderTextColor="black"
                            placeholder='E-mail'
                        />
                        <TextInput
                            inputMode="text"
                            secureTextEntry={true}
                            style={css.input}
                            value={clientGenere}
                            onChangeText={(digitado) => setGenero(digitado)}
                            placeholderTextColor="black"
                            placeholder='Senha'
                        />
                        <TouchableOpacity style={css.btnCreate} onPress={() => editClient()}>
                            <Text style={css.btnLoginText}>SALVAR</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </View>
    )
}

const css = StyleSheet.create({
    tudo: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        maxWidth: 600,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    flat: {
        width: '100%',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    text: {
        fontSize: 18,
        color: '#333',
    },
    btnEdit: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginLeft: 5,
    },
    btnDelete: {
        backgroundColor: '#F44336',
        padding: 10,
        borderRadius: 5,
        marginLeft: 5,
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    editar: {
        marginTop: 20,
    },

    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fafafa',
        fontSize: 16,
    },
    btnCreate: {
        backgroundColor: '#6200ee',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    btnLoginText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
