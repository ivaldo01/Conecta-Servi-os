import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { auth, db } from "./firebaseConfig";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import colors from "./colors";
import CustomButton from './components/CustomButton';

function formatCPF(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatRG(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1})$/, '$1-$2');
}

function formatTelefone(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

function CadastroMenor({ navigation }) {
  const [nomeMenor, setNomeMenor] = useState('');
  const [idadeMenor, setIdadeMenor] = useState('');
  const [cpfMenor, setCpfMenor] = useState('');
  const [rgMenor, setRgMenor] = useState('');
  const [telefoneMenor, setTelefoneMenor] = useState('');

  const handleCadastroMenor = async () => {
    if (!nomeMenor || !idadeMenor) {
      alert("Por favor, preencha os campos obrigatórios!");
      return;
    }
    const idade = parseInt(idadeMenor, 10);
    if (isNaN(idade) || idade > 17) {
      alert("Só é permitido cadastrar menores de até 17 anos.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Você precisa estar logado para cadastrar um menor.");
        return;
      }

      await addDoc(collection(doc(db, "usuarios", user.uid), "menores"), {
        nomeMenor,
        idadeMenor,
        cpfMenor,
        rgMenor,
        telefoneMenor,
        createdAt: serverTimestamp()
      });

      alert("Menor cadastrado com sucesso!");
      navigation.goBack();
    } catch (error) {
      alert("Erro ao cadastrar menor: " + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Menor</Text>

      <TextInput style={styles.input} placeholder="Nome" value={nomeMenor} onChangeText={setNomeMenor} />
      <TextInput style={styles.input} placeholder="Idade" value={idadeMenor} onChangeText={setIdadeMenor} keyboardType="numeric" />

      <TextInput
        style={styles.input}
        placeholder="CPF"
        keyboardType="numeric"
        value={cpfMenor}
        onChangeText={(t) => setCpfMenor(formatCPF(t))}
      />

      <TextInput
        style={styles.input}
        placeholder="RG"
        keyboardType="numeric"
        value={rgMenor}
        onChangeText={(t) => setRgMenor(formatRG(t))}
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        keyboardType="numeric"
        value={telefoneMenor}
        onChangeText={(t) => setTelefoneMenor(formatTelefone(t))}
      />

      <View style={styles.buttonContainer}>
        <CustomButton title="Cadastrar Menor" icon="person-add" color={colors.primary} onPress={handleCadastroMenor} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: 20 },
  title: { fontSize: 22, marginBottom: 20, fontWeight: 'bold', color: colors.textDark },
  input: { width: '90%', padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 15, borderRadius: 8, backgroundColor: '#fff' },
  buttonContainer: { width: '90%', marginTop: 20 },
});

export default CadastroMenor;