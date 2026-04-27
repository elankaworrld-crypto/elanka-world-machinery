import { useState, useMemo, useEffect } from 'preact/hooks';

export default function PriceFilter({ initialProducts, categoryName }) {
  const productsWithPrices = useMemo(() => {
    return initialProducts.map(p => {
      const priceString = (p.data.offerPrice || p.data.price || "0").toString();
      const numericPrice = parseInt(priceString.replace(/\D/g, ''), 10);
      return { ...p, numericPrice };
    });
  }, [initialProducts]);

  const pricesOnly = productsWithPrices.map(p => p.numericPrice).filter(n => !isNaN(n));
  const minPrice = Math.min(...pricesOnly) || 0;
  const maxPrice = Math.max(...pricesOnly) || 100000;

  const [currentMax, setCurrentMax] = useState(maxPrice);

  useEffect(() => {
    if (isFinite(maxPrice)) {
      setCurrentMax(maxPrice);
    }
  }, [maxPrice]);

  const filteredProducts = productsWithPrices.filter(p => p.numericPrice <= currentMax);

  return (
    <>
      <div class="price-filter-box">
        {/* FIX 1: Use htmlFor to connect the label to the input ID */}
        <label htmlFor="price-slider" class="current-filter-label">
          Show {categoryName} up to: <strong>Rs. {currentMax.toLocaleString()}</strong>
        </label>
        
        <input 
          type="range" 
          id="price-slider" // FIX 1: Added ID
          min={minPrice} 
          max={maxPrice} 
          value={currentMax} 
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
               {/* Good: You already have alt text here! */}
               <img src={item.data.image} alt={item.data.title} loading="lazy" />
            </div>
            <div class="card-info">
              <h3>{item.data.title}</h3>
              <p class="price">{item.data.offerPrice || item.data.price}</p>
              
              <div class="card-actions">
                {/* FIX 2: Descriptive Link for SEO/Accessibility */}
                <a 
                  href={`/products/${item.id}`} 
                  class="btn-learn"
                  aria-label={`Learn more about ${item.data.title}`}
                >
                  Learn More
                </a>
                
                <a 
                  href={`https://wa.me/94776344758?text=I%20am%20interested%20in%20${encodeURIComponent(item.data.title)}`} 
                  target="_blank" 
                  class="btn-whatsapp"
                  aria-label={`Inquire about ${item.data.title} on WhatsApp`}
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