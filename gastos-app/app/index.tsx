import { useRouter, useFocusEffect } from "expo-router";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useCallback, useState } from "react";

type Expense = {
  id: string;
  description: string;
  value: number;
};

// LISTA GLOBAL
export const expensesStore: Expense[] = [];

export default function Home() {
  const router = useRouter();

  const [expenses, setExpenses] =
    useState<Expense[]>(expensesStore);

  useFocusEffect(
    useCallback(() => {
      setExpenses([...expensesStore]);
    }, [])
  );

  const total = expenses.reduce(
    (acc, item) => acc + item.value,
    0
  );

  function deleteExpense(id: string) {
    const filtered = expensesStore.filter(
      (item) => item.id !== id
    );

    expensesStore.length = 0;
    expensesStore.push(...filtered);

    setExpenses([...expensesStore]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        💸 Caderneta de Gastos
      </Text>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>
          Total acumulado
        </Text>

        <Text style={styles.total}>
          R${" "}
          {total.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/add")}
      >
        <Text style={styles.addButtonText}>
          + Novo Gasto
        </Text>
      </TouchableOpacity>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhum gasto cadastrado
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>
                {item.description}
              </Text>

              <Text style={styles.cardValue}>
                R${" "}
                {item.value.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>

            <View style={styles.actions}>
              {/* EDITAR */}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  router.push({
                    pathname: "/add",
                    params: {
                      id: item.id,
                    },
                  })
                }
              >
                <Text style={styles.editText}>
                  ✎
                </Text>
              </TouchableOpacity>

              {/* EXCLUIR */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                  deleteExpense(item.id)
                }
              >
                <Text style={styles.deleteText}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 20,
    paddingTop: 70,
  },

  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 25,
  },

  totalCard: {
    backgroundColor: "#0F172A",
    padding: 25,
    borderRadius: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1E3A8A",
  },

  totalLabel: {
    color: "#94A3B8",
    fontSize: 16,
  },

  total: {
    color: "#60A5FA",
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 10,
  },

  addButton: {
    backgroundColor: "#2563EB",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 25,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  empty: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },

  card: {
    backgroundColor: "#0F172A",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  cardValue: {
    color: "#60A5FA",
    marginTop: 8,
    fontSize: 16,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },

  editButton: {
    backgroundColor: "#1D4ED8",
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  editText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  deleteButton: {
    backgroundColor: "#1E293B",
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  deleteText: {
    color: "#F87171",
    fontSize: 20,
    fontWeight: "bold",
  },
});