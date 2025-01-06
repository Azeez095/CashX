import api from "@/api/api";

export default {
  state: {
    transactions: [],
  },
  mutations: {
    viewAllTransactions(state, transactions) {
      state.transactions = transactions;
    },
    addTransaction(state, transaction) {
      state.transactions.unshift(transaction); // Add new transaction to the top
    },
    removeTransaction(state, id) {
      state.transactions = state.transactions.filter(
        (transaction) => transaction._id !== id
      ); // Remove the transaction from the list
    },
    editTransaction(state, updatedTransaction) {
      const index = state.transactions.findIndex(
        (transaction) => transaction._id === updatedTransaction._id
      );
      if (index !== -1) {
        state.transactions.splice(index, 1, updatedTransaction); // Replace the updated transaction
      }
    },
  },
  actions: {
    addTransaction({ commit }, transaction) {
      const payload = {
        narration: transaction.narration,
        category: transaction.category,
        amount: transaction.amount,
        type: transaction.type,
        budget_id: transaction.budget_id, // Assuming transaction belongs to a budget
      };

      return api
        .post("/api/transactions", payload)
        .then((response) => {
          if (response.status === 201) {
            commit("addTransaction", response.data.data);
            toast.success("Transaction added successfully!", {
              position: "top-center",
              autoClose: 1000,
            });
            return response.data.data; // Return the newly created transaction
          }
        })
        .catch((error) => {
          if (error.response.status === 403) {
            throw new Error(
              "Unable to create transaction, Category is mandatory."
            );
          } else {
            throw new Error("Failed to create transaction. Please try again.");
          }
        });
    },

    removeTransaction({ commit }, id) {
      return api
        .delete(`/api/transactions/${id}`)
        .then((response) => {
          if (response.status === 200) {
            commit("removeTransaction", id); // Directly remove the transaction
            return "Transaction removed successfully!"; // Return success message
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 500) {
            throw new Error(error.response.data.message); // Use the error message from the server
          } else {
            throw new Error("Failed to remove transaction. Please try again."); // Generic error message
          }
        });
    },

    viewAllTransactions({ commit }) {
      return api
        .get("/api/transactions?page=1&limit=1000")
        .then((response) => {
          const transactions = response.data.data;

          // Sort transactions by `createdAt` in descending order
          transactions.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          // Commit the sorted transactions to the state
          commit("viewAllTransactions", transactions);
        })
        .catch((error) => {
          console.error("Error fetching transactions:", error);
          throw new Error("Failed to load transactions. Please try again.");
        });
    },

    editTransaction({ commit }, { id, transaction }) {
      const payload = {
        amount: transaction.amount,
        category: transaction.category,
        narration: transaction.narration,
        type: transaction.type,
        budget_id: transaction.budget_id,
      };

      return api
        .put(`/api/transactions/${id}`, payload)
        .then((response) => {
          if (response.status === 200) {
            commit("editTransaction", response.data.data); // Update the transaction in the state
            return "Transaction updated successfully!"; // Return data for optional feedback
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 500) {
            throw new Error(
              "Failed to update transaction, Category is required."
            );
          } else {
            throw new Error("Failed to update transaction. Please try again.");
          }
        });
    },
  },
  getters: {
    allTransactions(state) {
      return state.transactions;
    },
  },
};
