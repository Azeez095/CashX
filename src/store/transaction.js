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
    async addTransaction({ commit }, transaction) {
      const payload = {
        narration: transaction.narration,
        category: transaction.category,
        amount: transaction.amount,
        type: transaction.type,
        budget_id: transaction.budget_id, // Assuming transaction belongs to a budget
      };

      try {
        const response = await api.post("/api/transactions", payload);
        if (response.status === 201) {
          commit("addTransaction", response.data.data);
          return response.data.message; // Return the newly created transaction
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          throw new Error(
            error.response.data.message
          );
        } else {
          throw new Error(
            error.response.data.message
          );
        }
      }
    },

    async removeTransaction({ commit }, id) {
      try {
        const response = await api.delete(`/api/transactions/${id}`);
        if (response.status === 200) {
          commit("removeTransaction", id); // Directly remove the transaction
          return response.data.message; // Return success message
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          throw new Error(error.response.data.message); // Use the error message from the server
        } else {
          throw new Error(error.response.data.message); // Generic error message
        }
      }
    },

    async viewAllTransactions({ commit }) {
      try {
        const response = await api.get("/api/transactions?page=1&limit=1000");
        const transactions = response.data.data;

        // Sort transactions by `createdAt` in descending order
        transactions.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Commit the sorted transactions to the state
        commit("viewAllTransactions", transactions);
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },

    async editTransaction({ commit }, { id, transaction }) {
      const payload = {
        amount: transaction.amount,
        category: transaction.category,
        narration: transaction.narration,
        type: transaction.type,
        budget_id: transaction.budget_id,
      };

      try {
        const response = await api.put(`/api/transactions/${id}`, payload);
        if (response.status === 200) {
          commit("editTransaction", response.data.data); // Update the transaction in the state
          return response.data.message; // Return data for optional feedback
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          throw new Error(
            error.response.data.message
          );
        } else {
          throw new Error(
            error.response.data.message);
        }
      }
    },
  },
  getters: {
    allTransactions(state) {
      return state.transactions;
    },
  },
};
