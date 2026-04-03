import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Fetching categories...')
      const { data, error } = await supabase
        .from('category')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      console.log('Categories fetched:', data)
      setCategories(data || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Add new category
  const addCategory = async (categoryName, categorySummary = '') => {
    setError(null)
    try {
      console.log('Adding category:', { name: categoryName, summary: categorySummary })
      const { data, error } = await supabase
        .from('category')
        .insert([
          {
            name: categoryName,
            summary: categorySummary || null,
            is_default: false,
            created_at: new Date().toISOString()
          }
        ])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      console.log('Category added:', data)
      const newCategory = data[0]
      setCategories([...categories, newCategory])
      return newCategory
    } catch (err) {
      console.error('Error adding category:', err)
      setError(err.message)
      throw err
    }
  }

  // Update category
  const updateCategory = async (id, updates) => {
    setError(null)
    try {
      const { data, error } = await supabase
        .from('category')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      setCategories(categories.map(cat => cat.id === id ? data[0] : cat))
      return data[0]
    } catch (err) {
      setError(err.message)
      console.error('Error updating category:', err)
      throw err
    }
  }

  // Delete category
  const deleteCategory = async (id) => {
    setError(null)
    try {
      const { error } = await supabase
        .from('category')
        .delete()
        .eq('id', id)

      if (error) throw error
      setCategories(categories.filter(cat => cat.id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting category:', err)
      throw err
    }
  }

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategories
  }
}
