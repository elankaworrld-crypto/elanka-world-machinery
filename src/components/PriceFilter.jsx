import { useState, useMemo, useEffect } from 'preact/hooks';

export default function PriceFilter({ initialProducts, categoryName }) {
  const productsWithPrices = useMemo(() => {
    return initialProducts.map(p => {
      // Clean the price string to get only numbers
      const priceString = (p.data.offerPrice || p.data.price || "0").toString();
      const numericPrice = parseInt(priceString.replace(/\D/g, ''), 10);
      return { ...p, numericPrice };
    });
  }, [initialProducts]);

  const pricesOnly = productsWithPrices.map(p => p.numericPrice).filter(n => !isNaN(n));
  const minPrice = Math.min(...pricesOnly) || 0;
  const maxPrice = Math.max(...pricesOnly) || 100000;

  // MICRO-FIX: Start with a high number, then sync in Step 2
  const [currentMax, setCurrentMax] = useState(maxPrice);

  // MICRO-FIX: This ensures the slider handles the new Ribbon prices immediately
  useEffect(() => {
    if (isFinite(maxPrice)) {
      setCurrentMax(maxPrice);
    }
  }, [maxPrice]);

  const filteredProducts = productsWithPrices.filter(p => p.numericPrice <= currentMax);

  return (
    <>
      <div class="price-filter-box">
        <label class="current-filter-label">
          Show {categoryName} up to: <strong>Rs. {currentMax.toLocaleString()}</strong>
        </label>
        
        <input 
          type="range" 
          min={minPrice} 
          max={maxPrice} 
          value={currentMax} 
          /* MICRO-FIX: If max price is low (like ribbons), use step 10. If high, use 500 */
          step={maxPrice > 5000 ? 500 : 10}
          onInput={(e) => setCurrentMax(parseInt(e.target.value))}
          class="price-range-input"
        />

        <div class="range-labels">
           <span>Min: Rs. {minPrice.toLocaleString()}</span>
           <span>Max: Rs. {maxPrice.toLocaleString()}</span>
        </div>
      </div>

      <div class="product-grid">
        {filteredProducts.map(item => (
          <div class="product-card" key={item.id}>
            <div class="img-container">
               <img src={item.data.image} alt={item.data.title} loading="lazy" />
            </div>
            <div class="card-info">
              <h3>{item.data.title}</h3>
              <p class="price">{item.data.offerPrice || item.data.price}</p>
              
              <div class="card-actions">
                <a href={`/products/${item.id}`} class="btn-learn">Learn More</a>
                <a 
                  href={`https://wa.me/94776344758?text=I%20am%20interested%20in%20${encodeURIComponent(item.data.title)}`} 
                  target="_blank" 
                  class="btn-whatsapp"
                >
                  WhatsApp Inquiry
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}