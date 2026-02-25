import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TextInput, Alert } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { db } from "./firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import colors from "./colors";

export default function BuscaProfissionais({ navigation }) {

  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [region, setRegion] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permissão de localização negada.");
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch {
        setRegion({
          latitude: -15.7801,
          longitude: -47.9292,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }

      const q = query(collection(db, "profissionais"), where("ativo", "==", true));
      const snapshot = await getDocs(q);

      const lista = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data?.location?.latitude && data?.location?.longitude) {
          lista.push({
            id: doc.id,
            ...data,
            location: {
              latitude: Number(data.location.latitude),
              longitude: Number(data.location.longitude),
            }
          });
        }
      });

      setProfissionais(lista);

    } catch (error) {
      console.log(error);
      Alert.alert("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const filtrados = useMemo(() => {
    const t = busca.toLowerCase();
    return profissionais.filter(p =>
      p.nome?.toLowerCase().includes(t) ||
      p.especialidade?.toLowerCase().includes(t)
    );
  }, [busca, profissionais]);

  // 🔥 AQUI É A MÁGICA DOS ÍCONES DINÂMICOS
  const getIconeEspecialidade = (especialidade) => {
    if (!especialidade) return "briefcase";

    const esp = especialidade.toLowerCase();

    if (esp.includes("barbeiro")) return "cut";
    if (esp.includes("mecanico")) return "construct";
    if (esp.includes("medico") || esp.includes("saude")) return "medical";
    if (esp.includes("advogado")) return "document-text";
    if (esp.includes("eletricista")) return "flash";
    if (esp.includes("professor")) return "school";
    if (esp.includes("dentista")) return "medkit";
    if (esp.includes("cabeleireiro")) return "color-wand";

    return "briefcase";
  };

  if (loading || !region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Buscar profissional..."
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
      >
        {filtrados.map((pro) => (
          <Marker
            key={pro.id}
            coordinate={pro.location}
            anchor={{ x: 0.5, y: 1 }}
          >
            {/* 🔥 Marker Customizado sem bug de corte */}
            <View style={styles.markerContainer}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name={getIconeEspecialidade(pro.especialidade)}
                  size={24}
                  color="#fff"
                />
              </View>
              <View style={styles.markerArrow} />
            </View>

            <Callout onPress={() => navigation.navigate("PerfilProfissional", { id: pro.id })}>
              <View style={styles.callout}>
                <Text style={{ fontWeight: "bold" }}>{pro.nome}</Text>
                <Text>{pro.especialidade}</Text>
              </View>
            </Callout>

          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  searchBox: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    elevation: 10,
    zIndex: 10
  },

  input: { flex: 1, marginLeft: 10 },

  markerContainer: {
    alignItems: "center",
    width: 60,
    height: 70,
  },

  iconCircle: {
    backgroundColor: colors.primary,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 6,
  },

  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 14,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: colors.primary,
    marginTop: -4,
  },

  callout: {
    width: 160,
    padding: 6
  }
});