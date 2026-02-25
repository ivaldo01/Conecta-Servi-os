import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Importando suas telas
import ChooseProfileScreen from './ChooseProfileScreen';
import SignUpCliente from './SignUpCliente';
import SignUpProEmpresa from './SignUpProEmpresa';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import CadastroMenor from './CadastroMenor';
import ListaMenores from './ListaMenores';
import EditarMenor from './EditarMenor';
import PerfilScreen from './PerfilScreen';
import EditarPerfil from './EditarPerfil';
import ConfigurarAgenda from './ConfigurarAgenda';
import BuscaProfissionais from './BuscaProfissionais';
import PerfilProfissional from './PerfilProfissional';
import AgendamentoFinal from './AgendamentoFinal'; // Verifique se o nome do arquivo está correto

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// 1. Definição das Rotas do Menu Lateral (Drawer)
function DrawerRoutes() {
  return (
    <Drawer.Navigator initialRouteName="TelaInicio">
      <Drawer.Screen name="TelaInicio" component={HomeScreen} options={{ title: 'Início' }} />
      <Drawer.Screen name="ListaMenores" component={ListaMenores} />
      <Drawer.Screen name="CadastroMenor" component={CadastroMenor} />
      <Drawer.Screen name="Perfil" component={PerfilScreen} />
      <Drawer.Screen
        name="BuscaProfissionais"
        component={BuscaProfissionais}
        options={{ title: 'Mapa de Profissionais' }}
      />
    </Drawer.Navigator>
  );
}

// 2. Estrutura Principal do App (Stack)
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>

        {/* Fluxo de Autenticação e Cadastro */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="ChooseProfile" component={ChooseProfileScreen} options={{ title: 'Escolha seu Perfil' }} />
        <Stack.Screen name="SignUpCliente" component={SignUpCliente} options={{ title: 'Cadastro Cliente' }} />
        <Stack.Screen name="SignUpProEmpresa" component={SignUpProEmpresa} options={{ title: 'Cadastro Profissional' }} />

        {/* Tela de Agenda (Fluxo Profissional) */}
        <Stack.Screen name="ConfigurarAgenda" component={ConfigurarAgenda} options={{ title: 'Minha Agenda' }} />

        {/* Navegação Principal (Drawer) */}
        <Stack.Screen name="Main" component={DrawerRoutes} options={{ headerShown: false }} />

        {/* Telas Extras e Navegação de Detalhes */}
        <Stack.Screen name="EditarMenor" component={EditarMenor} options={{ title: 'Editar Menor' }} />
        <Stack.Screen name="EditarPerfil" component={EditarPerfil} options={{ title: 'Editar Perfil' }} />

        {/* AQUI ESTAVA O SEGREDO: Registro da tela de Perfil */}
        <Stack.Screen
          name="PerfilProfissional"
          component={PerfilProfissional}
          options={{ title: 'Perfil do Profissional' }}
        />

        <Stack.Screen
          name="AgendamentoFinal"
          component={AgendamentoFinal}
          options={{ title: 'Finalizar Agendamento' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}