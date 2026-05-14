import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { expensesStore } from "./index";

export default function AddScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [description, setDescription] =
    useState("");

  const [value, setValue] = useState("");

  const [error, setError] = useState("");

  const editingId = params.id as string;

  useEffect(() => {
    if (editingId) {
      const expense = expensesStore.find(
        (item) => item.id === editingId
      );

      if (expense) {
        setDescription(expense.description);

        setValue(
          expense.value.toString()
        );
      }
    }
  }, []);

  function handleSave() {
    if (
      description.trim() === "" ||
      value.trim() === ""
    ) {
      setError("Preencha os campos.");
      return;
    }

    let formattedText = value.replace(
      /\s/g,
      ""
    );

    if (formattedText.includes(",")) {
      formattedText = formattedText
        .replace(/\./g, "")
        .replace(",", ".");
    } else {
      formattedText =
        formattedText.replace(/\./g, "");
    }

    const formattedValue =
      Number(formattedText);

    if (
      isNaN(formattedValue) ||
      formattedValue <= 0
    ) {
      setError("Digite um valor válido.");
      return;
    }

    if (editingId) {
      const expenseIndex =
        expensesStore.findIndex(
          (item) => item.id === editingId
        );

      if (expenseIndex !== -1) {
        expensesStore[expenseIndex] = {
          id: editingId,
          description,
          value: formattedValue,
        };
      }
    } else {
      expensesStore.push({
        id: Date.now().toString(),
        description,
        value: formattedValue,
      });
    }

    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingId
          ? "Editar Gasto"
          : "Novo Gasto"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        placeholderTextColor="#94A3B8"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Valor"
        placeholderTextColor="#94A3B8"
        keyboardType="decimal-pad"
        value={value}
        onChangeText={setValue}
      />

      {error !== "" && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>
          {editingId
            ? "Salvar Alteração"
            : "Salvar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 20,
    paddingTop: 80,
  },

  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
  },

  input: {
    backgroundColor: "#0F172A",
    borderRadius: 18,
    padding: 16,
    color: "#fff",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#1E293B",
    fontSize: 16,
  },

  error: {
    color: "#F87171",
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});