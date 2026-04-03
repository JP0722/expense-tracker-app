import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all expenses
  const fetchExpenses = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Fetching expenses...')
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      console.log('Expenses fetched:', data)
      setExpenses(data || [])
    } catch (err) {
      console.error('Error fetching expenses:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Add new expense
  const addExpense = async (expense) => {
    setError(null)
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([
          {
            description: expense.description,
            cost: expense.cost,
            category_id: expense.category_id,
            date: expense.date,
            created_at: new Date().toISOString()
          }
        ])
        .select('*, category(*)')

      if (error) throw error
      setExpenses([data[0], ...expenses])
      return data[0]
    } catch (err) {
      setError(err.message)
      console.error('Error adding expense:', err)
      throw err
    }
  }

  // Update expense
  const updateExpense = async (id, updates) => {
    setError(null)
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select('*, category(*)')

      if (error) throw error
      setExpenses(expenses.map(exp => exp.id === id ? data[0] : exp))
      return data[0]
    } catch (err) {
      setError(err.message)
      console.error('Error updating expense:', err)
      throw err
    }
  }

  // Delete expense
  const deleteExpense = async (id) => {
    setError(null)
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)

      if (error) throw error
      setExpenses(expenses.filter(exp => exp.id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting expense:', err)
      throw err
    }
  }

  // Fetch expenses on mount
  useEffect(() => {
    fetchExpenses()
  }, [])

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    fetchExpenses
  }
}

