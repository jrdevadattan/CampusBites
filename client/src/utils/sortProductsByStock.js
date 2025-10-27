/**
 * Sorts products by stock levels in the following order:
 * 1. Low stock (1-5 items) - shown first to create urgency
 * 2. High stock (>5 items) - shown second
 * 3. Out of stock (0 items) - shown last
 * 
 * @param {Array} products - Array of product objects
 * @returns {Array} - Sorted array of products
 */
export const sortProductsByStock = (products) => {
  if (!Array.isArray(products)) return [];
  
  return [...products].sort((a, b) => {
    const stockA = a.stock || 0;
    const stockB = b.stock || 0;
    
    // Define priority levels
    const getPriority = (stock) => {
      if (stock >= 1 && stock <= 5) return 1; // Low stock - highest priority
      if (stock > 5) return 2; // High stock - medium priority
      return 3; // Out of stock - lowest priority
    };
    
    const priorityA = getPriority(stockA);
    const priorityB = getPriority(stockB);
    
    // Sort by priority first
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    // If same priority, sort by stock amount
    // For low stock: ascending (1, 2, 3, 4, 5)
    // For high stock: descending (highest first)
    // For out of stock: keep original order
    if (priorityA === 1) {
      return stockA - stockB; // Ascending for low stock
    } else if (priorityA === 2) {
      return stockB - stockA; // Descending for high stock
    }
    
    return 0; // Keep original order for out of stock
  });
};