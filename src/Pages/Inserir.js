import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Button } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function Inserir() {

    const [email, setEmail] = useState("");
    const [clientname, setClientName] = useState("");
    const [genero, setGenero] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState(false);

    useEffect(() => {
      setSucesso(false);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
          setSucesso(false);
        }, [])
    );

    async function Cadastro() {
        await fetch('http://10.139.75.38:5251/InsertClients', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(
                {
                    clientEmail: email,
                    clientName: clientname,
                    clientGenere: genero,
                })
        })
            .then(res => (res.ok == true) ? res.json() : false)           
            .then(json => {
                setSucesso((json.clientId) ? true : false)
                setErro((json.clientId) ? false : true)
            })
            .catch(err => setErro(true))
    }

    return (
        <ScrollView contentContainerStyle={css.tudo}>
            {sucesso ?
                <View>
                  <Text style={css.text}>Obrigado por se cadastrar. Seu cadastro foi realizado com sucesso!</Text>  
                </View>               
                :
                <>
                    <View style={css.container}>
                        <TextInput
                            style={css.input}
                            placeholder="Nome"
                            TextInput={clientname}
                            onChangeText={(digitado) => setClientName(digitado)}
                            placeholderTextColor="#C6C6C6"
                        />
                        <TextInput
                            style={css.input}
                            placeholder="Email"
                            TextInput={email}
                            onChangeText={(digitado) => setEmail(digitado)}
                            placeholderTextColor="#C6C6C6"
                        />
                        <TextInput
                            style={css.input}
                            placeholder="Genero"
                            TextInput={genero}
                            onChangeText={(digitado) => setGenero(digitado)}
                            placeholderTextColor="#C6C6C6"
                        />                    
                        <TouchableOpacity style={css.btn} onPress={Cadastro}>
                          <Text style={css.btnText}>CADASTRAR</Text>
                        </TouchableOpacity>
                    </View>
                    {erro && <Text style={css.text}>Confira os campos e tente novamente</Text>}
                </>
            }
        </ScrollView>
    )
}

const css = StyleSheet.create({
  tudo: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  container: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  btn: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successText: {
    color: '#28a745',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
