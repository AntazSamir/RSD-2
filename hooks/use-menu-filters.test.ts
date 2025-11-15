import { renderHook, act } from "@testing-library/react"
import { useMenuFilters } from "./use-menu-filters"
import { MenuItem } from "@/lib/types"

const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Cheeseburger",
    description: "A classic cheeseburger",
    price: 10.99,
    category: "Burgers",
    imageUrl: "",
    isUnavailable: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Pizza",
    description: "A delicious pizza",
    price: 12.99,
    category: "Pizza",
    imageUrl: "",
    isUnavailable: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Salad",
    description: "A healthy salad",
    price: 8.99,
    category: "Salads",
    imageUrl: "",
    isUnavailable: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Bacon Burger",
    description: "A burger with bacon",
    price: 11.99,
    category: "Burgers",
    imageUrl: "",
    isUnavailable: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

describe("useMenuFilters", () => {
  it("should return all items initially", () => {
    const { result } = renderHook(() => useMenuFilters(mockMenuItems))
    expect(result.current.filteredItems).toHaveLength(4)
  })

  it("should filter by search query", () => {
    const { result } = renderHook(() => useMenuFilters(mockMenuItems))
    act(() => {
      result.current.setSearchQuery("burger")
    })
    expect(result.current.filteredItems).toHaveLength(2)
    expect(result.current.filteredItems[0].name).toBe("Cheeseburger")
    expect(result.current.filteredItems[1].name).toBe("Bacon Burger")
  })

  it("should filter by category", () => {
    const { result } = renderHook(() => useMenuFilters(mockMenuItems))
    act(() => {
      result.current.setSelectedCategory("Burgers")
    })
    expect(result.current.filteredItems).toHaveLength(2)
  })

  it("should filter by search query and category", () => {
    const { result } = renderHook(() => useMenuFilters(mockMenuItems))
    act(() => {
      result.current.setSearchQuery("cheese")
      result.current.setSelectedCategory("Burgers")
    })
    expect(result.current.filteredItems).toHaveLength(1)
    expect(result.current.filteredItems[0].name).toBe("Cheeseburger")
  })

  it("should reset filters", () => {
    const { result } = renderHook(() => useMenuFilters(mockMenuItems))
    act(() => {
      result.current.setSearchQuery("cheese")
      result.current.setSelectedCategory("Burgers")
    })
    expect(result.current.filteredItems).toHaveLength(1)
    act(() => {
      result.current.resetFilters()
    })
    expect(result.current.filteredItems).toHaveLength(4)
  })

  it("should return the correct categories", () => {
    const { result } = renderHook(() => useMenuFilters(mockMenuItems))
    expect(result.current.categories).toEqual(["all", "Burgers", "Pizza", "Salads"])
  })
})
