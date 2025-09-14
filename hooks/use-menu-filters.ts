"use client"

import { useState, useMemo } from "react"
import type { MenuItem } from "@/lib/types"

export function useMenuFilters(menuItems: MenuItem[]) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(menuItems.map((item) => item.category)))]
  }, [menuItems])

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [menuItems, searchQuery, selectedCategory])

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
  }

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredItems,
    resetFilters,
  }
}
